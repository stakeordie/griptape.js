import { Coin, StdFee } from 'secretjs/types/types.js';
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
export declare type ContractRequest = Record<string, unknown>;
export declare function createContract(contract: Record<string, unknown>): Record<string, any>;
export declare function extendContract(base: Record<string, any>, extended: Record<string, any>): Record<string, any>;
export interface BaseContract {
}
export interface Snip20 extends BaseContract {
    /**
     * Returns the balance of the given address. Returns "0" if the address is unknown to the contract.
     */
    getBalance(): ContractRequest;
    /**
     * This query need not be authenticated.
     * Returns the token info of the contract. The response MUST contain: token name, token symbol, and the number of decimals the token uses. The response MAY additionally contain the total-supply of tokens. This is to enable Layer-2 tokens which want to hide the amounts converted as well.
     */
    getTokenInfo(): ContractRequest;
    /**
     * This query MUST be authenticated.
     * This query SHOULD return a list of json objects describing the transactions made by the querying address, in newest-first order. The user may optionally specify a limit on the amount of information returned by paging the available items.
     *
     * @param page_size Number of transactions to return, starting from the latest. i.e. n=1 will return only the latest transaction
     * @param page This defaults to 0. Specifying a positive number will skip page * page_size txs from the start.
     */
    getTransferHistory(page_size: number, page?: number): ContractRequest;
    /**
     * This query need not be authenticated.
     * Gets information about the token exchange rate functionality that the contract provides. This query MUST return.
     */
    getExchangeRate(): ContractRequest;
    /**
     * Moves tokens from the account that appears in the Cosmos message sender field to the account in the recipient field.
     *
     * @param recipient Accounts SHOULD be a valid bech32 address, but contracts may use a different naming scheme as well
     * @param amount 	The amount of tokens to transfer
     */
    transfer(recipient: string, amount: string): ContractRequest;
    /**
     * Moves amount from the Cosmos message sender account to the recipient account. The receiver account MAY be a contract that has registered itself using a RegisterReceive message
     *
     * @param recipient  Accounts SHOULD be a valid bech32 address, but contracts may use a different naming scheme as well
     * @param amount The amount of tokens to send
     * @param msg Base64 encoded message, which the recipient will receive
     */
    send(recipient: string, amount: string, msg?: string): ContractRequest;
    /**
     * This message is used to tell the SNIP-20 contract to call the Receive function of the Cosmos message sender after a successful Send.
     *
     * @param code_hash A 32-byte hex encoded string, with the code hash of the receiver contract
     */
    registerReceived(code_hash: string): ContractRequest;
    /**
     * This function generates a new viewing key for the Cosmos message sender,
     * which is used in ALL account specific queries. This key is used to validate the identity of the caller, since in queries in Cosmos there is no way to cryptographically authenticate the querier's identity.
     *
     * @param entropy A source of random information
     */
    createViewingKey(entropy: string): ContractRequest;
    /**
     * Set a viewing key with a predefined value for Cosmos message sender, without creating it. This is useful to manage multiple SNIP-20 tokens using the same viewing key.
     *
     * @param key A user supplied string that will be used to authenticate the sender
     */
    setViewingKey(key: string): ContractRequest;
    /**
     * Deposits a native coin into the contract, which will mint an equivalent amount of tokens to be created.
     * The amount MUST be sent in the sent_funds field of the transaction itself, as coins must really be sent to the contract's native address.
     */
    deposit(): ContractRequest;
    /**
     * Redeems tokens in exchange for native coins. The redeemed tokens SHOULD be burned, and taken out of the pool.
     *
     * @param amount The amount of tokens to redeem to
     * @param denom Denom of tokens to mint. Only used if the contract supports multiple denoms
    */
    redeem(amount: string, denom?: string): ContractRequest;
}
