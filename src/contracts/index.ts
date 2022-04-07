import { ExecuteResult, BroadcastMode, TxsResponse } from 'secretjs';
import {
  queryContract,
  executeContract,
  getHeight,
  getAddress,
  instantiate,
  getSigningClient,
  getConfig,
} from '../bootstrap';
import { viewingKeyManager } from '../bootstrap';
import {
  Context,
  ContractMessageRequest,
  ContractDefinition,
  ContractSpecification,
  ContractMessageResponse,
  ContractInstantiationRequest,
  MessageEntry,
  MessageGetter,
  MultiMessageInfo,
  BaseContract,
} from './types';
import { getErrorHandler, BaseError } from './errors';
import {
  getEntropyString,
  calculateCommonKeys,
  getFeeForExecute,
  sleep,
} from './utils';
import { Coin } from 'secretjs/types/types';
import { Encoding } from '@iov/encoding';
import { getWindow } from '../utils';
import { permitManager } from '..';

const decoder = new TextDecoder('utf-8');

const QUERY_TYPE = 'query';
const MESSAGE_TYPE = 'message';

const contractRegistry: any[] = [];

export class ContractTxResponseHandler<T>
  implements ContractMessageResponse<T>
{
  private readonly response: ExecuteResult | TxsResponse;

  private constructor(response: ExecuteResult | TxsResponse) {
    this.response = response;
  }

  parse(): any {
    return JSON.parse(decoder.decode(this.response.data));
  }

  getRaw(): ExecuteResult | TxsResponse {
    return this.response;
  }

  isEmpty(): boolean {
    return typeof this.response === 'undefined';
  }

  static of<T>(
    response: ExecuteResult | TxsResponse
  ): ContractMessageResponse<T> {
    return new ContractTxResponseHandler<T>(response);
  }
}

async function getContext(contractAddress: string): Promise<Context> {
  // Get all context variables.
  const address = getAddress();
  const key = viewingKeyManager.get(contractAddress);
  const padding = getEntropyString(32);
  const entropy = getWindow()?.btoa(getEntropyString(32));
  function withHeight(cb: (height: number) => Record<string, unknown>): any {
    return cb;
  }
  const account = permitManager.getAccount();
  let permitData = account?.permits.find(
    permit => permit.contractAddress == contractAddress
  );

  const permit = permitData?.permit;
  // Set the context.
  return { address, key, padding, withHeight, entropy, permit } as Context;
}

interface TxHandlerResponse {
  found: boolean;
  response: TxsResponse | undefined;
}

async function handleResponse(txHash: string): Promise<TxHandlerResponse> {
  let result = false;
  let tx;

  while (true) {
    try {
      tx = await getSigningClient().restClient.txById(txHash, true);

      if (!tx.raw_log.startsWith('[')) {
        result = false;
      } else {
        result = true;
      }

      break;
    } catch (error) {
      // waiting for the transaction to commit
    }

    await sleep(6000);
  }

  return { found: result, response: tx };
}

/**
 * @deprecated use the new {@link createContractClient} API instead
 * @param contract object of contract specification
 * @returns T
 */
export function createContract<T>(contract: ContractSpecification): T {
  const codeHash = contract.codeHash;
  const handler = {
    get(contract: Record<string, any>, prop: string) {
      if (typeof contract[prop] !== 'function') {
        return Reflect.get(contract, prop);
      }

      return new Proxy(contract[prop], {
        // Trap to get the target function.
        get: (func, prop) => {
          if (prop === 'target') {
            return func;
          }
          return Reflect.get(func, prop);
        },

        apply: async (func: any, thisArg: any, argumentsList: any) => {
          const { at: contractAddress } = contract;
          const ctx = await getContext(contractAddress);
          const args = [ctx, ...argumentsList];

          // Call the method, injecting the context.
          let queryOrMessage = Reflect.apply(func, thisArg, args);
          let result;
          //get height when required
          if (typeof queryOrMessage == 'function') {
            const height = await getHeight();
            result = queryOrMessage(height);
          } else {
            result = queryOrMessage;
          }
          if (func.type === QUERY_TYPE) {
            const _ = undefined; // TODO: Handle added params
            return queryContract(contractAddress, result, _, codeHash);
          } else if (func.type === MESSAGE_TYPE) {
            const {
              handleMsg,
              memo,
              transferAmount: rawTransferAmount,
              fees,
            } = result as ContractMessageRequest;
            const calculatedFee = getFeeForExecute(fees);
            const transferAmount = rawTransferAmount
              ? ([rawTransferAmount] as Coin[])
              : [];
            try {
              const response = await executeContract(
                contractAddress,
                handleMsg,
                memo,
                transferAmount,
                calculatedFee,
                codeHash
              );

              const config = getConfig();
              if (!config) throw new Error('No config available');
              if (config.broadcastMode == BroadcastMode.Sync) {
                const result = await handleResponse(response.transactionHash);
                if (result.found && result.response) {
                  const { response: txResponse } = result;
                  return ContractTxResponseHandler.of(txResponse);
                } else {
                  const { response: txResponse } = result;
                  throw new BaseError(
                    `Could not found TX: ${response.transactionHash}`,
                    { cause: subtractErrorFromResponse(txResponse) }
                  );
                }
              } else {
                return ContractTxResponseHandler.of(response);
              }
            } catch (e: any) {
              const errorHandler = getErrorHandler(contract.id, e);
              if (errorHandler) {
                errorHandler.handler();
              } else {
                throw e;
              }
            }
          }

          return Reflect.apply(func, thisArg, argumentsList);
        },
      });
    },
  };

  const {
    id,
    at,
    definition: { queries: q, messages: m },
  }: any = contract;

  // Handling when no queries or messages are defined in the contract
  // definition.
  let queries = q || {};
  let messages = m || {};

  // Setting the type of queries and messages.
  Object.keys(queries).forEach(it => (queries[it].type = QUERY_TYPE));
  Object.keys(messages).forEach(it => (messages[it].type = MESSAGE_TYPE));

  // Define the target object.
  const givenId = contract.id || contract.at;
  const target = { id: givenId, at, ...queries, ...messages };

  // Create a new proxy for that target.
  const result = new Proxy(target, handler);

  // Add to contract registry.
  const idx = contractRegistry.findIndex(it => it.id === contract.id);
  if (idx === -1) {
    contractRegistry.push(result);
  }

  return result;
}

function subtractErrorFromResponse(response: TxsResponse | undefined): string {
  if (!response || !response.raw_log) return 'Empty response or unknown error';
  const raw = response.raw_log;
  // Generic Errors are return as JSON stringified
  // Exam. '{"generic_error": { "msg":"" } }'
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');

  if (jsonStart > 0 && jsonEnd > 0) {
    return raw.substring(jsonStart, jsonEnd + 1);
  } else {
    return raw;
  }
}
/**
 * @param contract object of contract specification
 * @returns T
 */
export function createContractClient<T>(contract: ContractSpecification): T {
  return createContract<T>(contract);
}

export function extendContract(
  base: ContractDefinition,
  extended: ContractDefinition
): ContractDefinition {
  const { messages: baseMessages = {}, queries: baseQueries = {} } = base;
  const { messages: defMessages = {}, queries: defQueries = {} } = extended;

  // Check messages common keys.
  const baseMessagesKeys = Object.keys(baseMessages);
  const defMessagesKeys = Object.keys(defMessages);
  const messageKeys = calculateCommonKeys(baseMessagesKeys, defMessagesKeys);

  // Check queries common keys.
  const baseQueriesKeys = Object.keys(baseQueries);
  const defQueriesKeys = Object.keys(defQueries);
  const queriesKey = calculateCommonKeys(baseQueriesKeys, defQueriesKeys);

  // Bind `base` and `def` definitions.
  const result = {
    messages: {
      ...base.messages,
      ...extended.messages,
    },
    queries: {
      ...base.queries,
      ...extended.queries,
    },
  };

  // Override common keys with def values.
  messageKeys.forEach(key => {
    result.messages[key] = defMessages[key];
  });

  queriesKey.forEach(key => {
    result.queries[key] = defQueries[key];
  });

  return result;
}

export function refContract<T>(idOrAddress: string): T {
  const contract = contractRegistry.find(
    it => it.id === idOrAddress || it.at === idOrAddress
  );
  if (!contract)
    throw new Error(`No contract found with id or address ${idOrAddress}`);
  return contract;
}

/**
 * Instantiate a contract by providing a {@link ContractInstantiationRequest}.
 * The instantiated contract is then available in the Contract Registry,
 * therefore, you can get the returned reference of get one using
 * {@link refContract}.
 *
 * @template T
 * @param {ContractInstantiationRequest} req - The request to instantiate
 * a contract.
 * @return {Promise<T>} a contract instance.
 */
export async function instantiateContract<T>(
  req: ContractInstantiationRequest
): Promise<T> {
  const { id, definition, codeId, label, initMsg } = req;
  const { contractAddress: at } = await instantiate(codeId, initMsg, label);
  const spec: ContractSpecification = {
    id,
    at,
    definition,
  };
  return createContract<T>(spec);
}

/**
 * Execute multiple messages from multiple contracts.
 * @param infos An object provided by {@link message} call.
 * @param memo An optional memo for this message execution.
 * @returns Contract message responses.
 */
export async function executeMultiMessage<R>(
  infos: MultiMessageInfo[],
  memo?: string
): Promise<ContractMessageResponse<R>> {
  const messages: MessageEntry[] = [];
  let fees = 0;

  for (const info of infos) {
    const { at: contractAddress } = info.contract;
    const ctx = await getContext(contractAddress);
    const message = info.getMessage(ctx, ...info.args);
    const transferAmount = message.transferAmount
      ? ([message.transferAmount] as Coin[])
      : [];
    const entry = {
      contractAddress: contractAddress,
      handleMsg: message.handleMsg,
      transferAmount: transferAmount,
    };
    messages.push(entry);
    fees += message.fees ? message.fees : 0;
  }

  const response = await getSigningClient().multiExecute(
    messages,
    memo,
    getFeeForExecute(fees)
  );
  return ContractTxResponseHandler.of(response);
}

/**
 * Provides {@link executeMultiMessage} with all required information to execute a
 * transaction on the given contract in order to perform multiple executions of
 * messages.
 * @param contract Contract that has the message to execute.
 * @param message Message to execute.
 * @param args Arguments of the message to execute.
 * @returns {MultiMessageInfo} All info to execute the message.
 */
export function buildMessage(
  contract: BaseContract,
  message: MessageGetter,
  ...args: unknown[]
): MultiMessageInfo {
  // @ts-ignore
  const getMessage = message.target;
  return { getMessage, contract, args };
}
