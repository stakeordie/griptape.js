import { ExecuteResult } from 'secretjs';
import {
  queryContract,
  executeContract,
  getHeight,
  getAddress,
  instantiate,
} from '../bootstrap';
import { viewingKeyManager } from '../bootstrap';
import {
  Context,
  ContractExecuteRequest,
  BaseContract,
  BaseContractProps,
  ContractRequest,
  ContractDefinition,
  ContractSpecification,
  ContractTxResponse,
  ContractInstantiationRequest,
} from './types';
import { getErrorHandler } from './errors';
import { getEntropyString, calculateCommonKeys } from './utils';

const decoder = new TextDecoder('utf-8');

const QUERY_TYPE = 'query';
const MESSAGE_TYPE = 'message';

const contractRegistry: any[] = [];

export class ContractTxResponseHandler implements ContractTxResponse {
  private readonly response: ExecuteResult;

  private constructor(response: ExecuteResult) {
    this.response = response;
  }

  parse(): any {
    return JSON.parse(decoder.decode(this.response.data));
  }

  parseFull(): any {
    return this.response;
  }

  isEmpty(): boolean {
    return typeof this.response === 'undefined';
  }

  static of(response: ExecuteResult): ContractTxResponse {
    return new ContractTxResponseHandler(response);
  }
}

export function createContract<Type>(contract: ContractSpecification): Type {
  const handler = {
    get(contract: Record<string, any>, prop: string) {
      if (typeof contract[prop] !== 'function') {
        return Reflect.get(contract, prop);
      }

      return new Proxy(contract[prop], {
        apply: async (func: any, thisArg: any, argumentsList: any) => {
          const { at: contractAddress } = contract;

          // Get all context variables.
          const address = getAddress();
          const key = viewingKeyManager.get(contractAddress);
          const height = await getHeight();
          const padding = getEntropyString(12);
          const entropy = getEntropyString(12);
          // Set the context.
          const ctx = { address, key, height, padding, entropy } as Context;
          const args = [ctx, ...argumentsList];

          // Call the method, injecting the context.
          const result = Reflect.apply(func, thisArg, args);

          if (func.type === QUERY_TYPE) {
            return queryContract(contractAddress, result);
          } else if (func.type === MESSAGE_TYPE) {
            const { handleMsg, memo, transferAmount, fee } =
              result as ContractExecuteRequest;
            try {
              const response = await executeContract(
                contractAddress,
                handleMsg,
                memo,
                transferAmount,
                fee
              );
              return ContractTxResponseHandler.of(response);
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
  const target = { id, at, ...queries, ...messages };

  // Create a new proxy for that target.
  const result = new Proxy(target, handler);

  // Add to contract registry.
  const idx = contractRegistry.findIndex(it => it.id === contract.id);
  if (idx === -1) {
    contractRegistry.push(result);
  }

  return result;
}

export function extendContract(
  base: ContractDefinition,
  extended: ContractDefinition
): Record<string, any> {
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
    result.messages[key] = extended.messages[key];
  });

  queriesKey.forEach(key => {
    result.queries[key] = extended.queries[key];
  });

  // Warnings.
  if (messageKeys.length > 0) {
    console.warn(
      `You overrided the following values from Messages object:
        ${messageKeys.toString()}`
    );
  }
  if (queriesKey.length > 0) {
    console.warn(
      `You overrided the following values from Queries object:
        ${queriesKey.toString()}`
    );
  }

  return result;
}

export function refContract<Type>(idOrAddress: string): Type {
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
