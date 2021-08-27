import {
  queryContract,
  executeContract,
  getHeight
} from './bootstrap';
import { Coin, StdFee } from 'secretjs/types/types.js';
import { griptape, viewingKeyManager } from './index.js';

const QUERY_TYPE = 'query';
const MESSAGE_TYPE = 'message';

function getEntropyString(length: number): string {
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result           = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getValue(object: any, key: string): any {
  let value;
  Object.keys(object).some(k => {
    if (k === key) {
      value = object[k];
      return true;
    }
    if (object[k] && typeof object[k] === 'object') {
      value = getValue(object[k], key);
      return value !== undefined;
    }
  });
  return value;
}

function hasOwnDeepProperty(obj: any, prop: string): boolean {
  if (typeof obj === 'object' && obj !== null) {
    if (obj.hasOwnProperty(prop)) {
      return true;
    }
    for (const p in obj) {
      if (obj.hasOwnProperty(p) &&
          hasOwnDeepProperty(obj[p], prop)) {
        return true;
      }
    }
  }
  return false;
}

function warn(func: any, result: any, msg: string): void {
  console.warn(`Cannot call ${func.type} -> ${JSON.stringify(result)}: ${msg}`);
}

export interface Context {
  address?: string;
  key?: string;
  padding?: string;
  height?: number;
}

export interface ContractExecuteRequest {
  handleMsg: Record<string, unknown>;
  memo?: string;
  transferAmount?: readonly Coin[];
  fee?: StdFee;
}

export type ContractRequest = Record<string, unknown>;

export function createContract<Type>(contract: Record<string, unknown>):
  Type {

  const handler = {
    get(contract: Record<string, any>, prop: string) {
      if (typeof contract[prop] !== 'function') {
        return Reflect.get(contract, prop);
      }

      return new Proxy(contract[prop], {
        apply: async (func: any, thisArg: any, argumentsList: any) => {
          const { at: contractAddress } = contract;

          // Get all context variables.
          const address = griptape.address;
          const key = viewingKeyManager.get(contractAddress);
          const height = await getHeight();
          const padding = getEntropyString(12);

          // Set the context.
          const ctx = { address, key, height, padding } as Context;
          const args = [ctx, ...argumentsList];

          // Call the method, injecting the context.
          const result = Reflect.apply(func, thisArg, args);

          const hasAddress = getValue(result, 'address');
          if (hasOwnDeepProperty(result, 'address') && !hasAddress) {
            warn(func, result, 'No address available');
            return;
          }

          const hasKey = getValue(result, 'key');
          if (hasOwnDeepProperty(result, 'key') && !hasKey) {
            warn(func, result, 'No key available');
            return;
          }

          if (func.type === QUERY_TYPE) {
            return queryContract(contractAddress, result);
          } else if (func.type === MESSAGE_TYPE) {
            const {
              handleMsg,
              memo,
              transferAmount,
              fee
            } = result as ContractExecuteRequest;
            return executeContract(
              contractAddress,
              handleMsg,
              memo,
              transferAmount,
              fee
            );
          }

          return Reflect.apply(func, thisArg, argumentsList);
        }
      });
    }
  };

  const { id, at, definition: { queries: q, messages: m } }: any = contract;

  // Handling when no queries or messages are defined in the contract
  // definition.
  let queries = q || {};
  let messages = m || {};

  // Setting the type of queries and messages.
  Object.keys(queries).forEach(it => queries[it].type = QUERY_TYPE)
  Object.keys(messages).forEach(it => messages[it].type = MESSAGE_TYPE)

  // Define the target object.
  const target = { id, at, ...queries, ...messages };

  // Create a new proxy for that target.
  return new Proxy(target, handler);
}

/**
 * Binds two Definition objects into one. Similar to inherence in Object Oriented Programing.
 * 
 * If they have similar either Queries or Messages `extended` will override `base` properties
 * 
 * @param base Base Definition object (can be overrided with extendend Definition)
 * @param extended Child Definition object all it's Queries and Messages may override the base defition
 * @returns Returns a Definition object that you can pass in to a `createContract` function
 * 
 * For more info checkout our documentation here https://docs.vue.griptapejs.com/
 */
export function extendContract(base: Record<string,any>,extended: Record<string,any>):
  Record<string, any> {

    const {
      messages: baseMessages = { },
      queries : baseQueries  = { },
    } = base;

    const {
      messages: defMessages = { },
      queries : defQueries  = { },
    } = extended;

    // Check messages common keys.
    const baseMessagesKeys = Object.keys(baseMessages);
    const defMessagesKeys  = Object.keys(defMessages);
    const messageKeys      = calculateCommonKeys(baseMessagesKeys, defMessagesKeys);

    // Check queries common keys.
    const baseQueriesKeys = Object.keys(baseQueries);
    const defQueriesKeys  = Object.keys(defQueries);
    const queriesKey      = calculateCommonKeys(baseQueriesKeys, defQueriesKeys);

    // Bind `base` and `def` definitions.
    const result = {
      messages:{
        ...base.messages,
        ...extended.messages,
      },
      queries:{
        ...base.queries,
        ...extended.queries,
      }
    };

    // Override common keys with def valuesS.
    messageKeys.forEach( key => {
      result.messages[key] = extended.messages[key]
    });

    queriesKey.forEach( key => {
      result.queries[key] = extended.queries[key]
    });

    // Warnings.
    if(messageKeys.length > 0) {
      console.warn(`You overrided the following values from Messages object: ${messageKeys.toString()}`)
    }
    if(queriesKey.length > 0) {
      console.warn(`You overrided the following values from Queries object: ${queriesKey.toString()}`)
    }

    return result;
}

function calculateCommonKeys( baseKeys: Array<string>, defKeys: Array<string> ) : 
Array<string> {
 
  if( baseKeys.length === 0 || defKeys.length === 0 ) return [];

  const result:Array<string> = baseKeys.filter((key)=> defKeys.find( (k) => k === key)); 
  return result;
}

export interface BaseContract {}
export interface Snip20 extends BaseContract {

  /**
   * Returns the balance of the given address. Returns "0" if the address is unknown to the contract.
   */
  getBalance() : ContractRequest;


  /**
   * This query need not be authenticated.
   * Returns the token info of the contract. The response MUST contain: token name, token symbol, and the number of decimals the token uses. The response MAY additionally contain the total-supply of tokens. This is to enable Layer-2 tokens which want to hide the amounts converted as well.
   */
  getTokenInfo() : ContractRequest;


  /**
   * This query MUST be authenticated.
   * This query SHOULD return a list of json objects describing the transactions made by the querying address, in newest-first order. The user may optionally specify a limit on the amount of information returned by paging the available items.
   * 
   * @param page_size Number of transactions to return, starting from the latest. i.e. n=1 will return only the latest transaction
   * @param page This defaults to 0. Specifying a positive number will skip page * page_size txs from the start. 
   */
   getTransferHistory(page_size:number,page?:number) :ContractRequest;


   /**
    * This query need not be authenticated.
    * Gets information about the token exchange rate functionality that the contract provides. This query MUST return.
    */
   getExchangeRate():ContractRequest;


   /**
    * Moves tokens from the account that appears in the Cosmos message sender field to the account in the recipient field.
    * 
    * @param recipient Accounts SHOULD be a valid bech32 address, but contracts may use a different naming scheme as well
    * @param amount 	The amount of tokens to transfer
    */
   transfer(recipient:string,amount:string):ContractRequest;


   /**
    * Moves amount from the Cosmos message sender account to the recipient account. The receiver account MAY be a contract that has registered itself using a RegisterReceive message
    * 
    * @param recipient  Accounts SHOULD be a valid bech32 address, but contracts may use a different naming scheme as well
    * @param amount The amount of tokens to send
    * @param msg Base64 encoded message, which the recipient will receive
    */
   send(recipient:string,amount:string,msg?:string):ContractRequest;


   /**
    * This message is used to tell the SNIP-20 contract to call the Receive function of the Cosmos message sender after a successful Send.
    * 
    * @param code_hash A 32-byte hex encoded string, with the code hash of the receiver contract
    */
   registerReceived(code_hash:string):ContractRequest;


   /**
    * This function generates a new viewing key for the Cosmos message sender,
    * which is used in ALL account specific queries. This key is used to validate the identity of the caller, since in queries in Cosmos there is no way to cryptographically authenticate the querier's identity.
    * 
    * @param entropy A source of random information
    */
   createViewingKey(entropy:string):ContractRequest;


   /**
    * Set a viewing key with a predefined value for Cosmos message sender, without creating it. This is useful to manage multiple SNIP-20 tokens using the same viewing key.
    * 
    * @param key A user supplied string that will be used to authenticate the sender
    */
   setViewingKey(key:string):ContractRequest;


   /**
    * Deposits a native coin into the contract, which will mint an equivalent amount of tokens to be created. 
    * The amount MUST be sent in the sent_funds field of the transaction itself, as coins must really be sent to the contract's native address. 
    * 
    */
   deposit():ContractRequest;


   /**
    * Redeems tokens in exchange for native coins. The redeemed tokens SHOULD be burned, and taken out of the pool.
    * 
    * @param amount The amount of tokens to redeem to
    * @param denom Denom of tokens to mint. Only used if the contract supports multiple denoms
    */
   redeem(amount:string,denom?:string):ContractRequest;
}