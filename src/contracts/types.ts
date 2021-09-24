import { Coin, StdFee } from 'secretjs/types/types.js';

export interface Context {
  address?: string;
  key?: string;
  padding?: string;
  height?: number;
  entropy?: string;
}

export interface ContractMessageResponse {
  parse(): object;
  parseFull(): object;
  isEmpty(): boolean;
}

export type ContractQueryRequest = Record<string, Record<string, any>>;

export interface ContractMessageRequest {
  handleMsg: Record<string, unknown>;
  memo?: string;
  transferAmount?: readonly Coin[];
  fee?: StdFee;
}

export interface ContractDefinition {
  queries?: Record<
    string,
    (context: Context, ...args: any[]) => ContractQueryRequest
  >;
  messages?: Record<
    string,
    (context: Context, ...args: any[]) => ContractMessageRequest
  >;
}

export interface BaseContractProps {
  id: string;
  at: string;
}

export interface BaseContract extends BaseContractProps {}

export interface Snip20Contract extends BaseContract {
  getBalance(): any;
  getTokenInfo(): any;
  getTransferHistory(page_size: number, page?: number): any;
  getMinters(): any;
  getAllowance(owner: string, spender: string, key: string): any;
  getExchangeRate(): any;
  transfer(recipient: string, amount: string): any;
  send(recipient: string, amount: string, msg?: string): any;
  registerReceived(code_hash: string): any;
  createViewingKey(): Promise<ContractMessageResponse>;
  setViewingKey(key: string): any;
  increaseAllowances(spender: string, amount: string, expiration?: number): any;
  decreaseAllowance(spender: string, amount: string, expiration?: number): any;
  transferFrom(owner: string, recipient: string, amount: string): any;
  sendFrom(owner: string, recipient: string, amount: string, msg?: string): any;
  mint(recipient: string, amount: string): any;
  setMinters(minters: string[]): any;
  burn(amount: string): any;
  burnFrom(owner: string, amount: string): any;
  deposit(): any;
  redeem(amount: string, denom?: string): any;
}

export interface ContractSpecification extends BaseContractProps {
  definition: ContractDefinition;
}

export interface ContractInstantiationRequest {
  id: string;
  codeId: number;
  definition: ContractDefinition;
  label: string;
  initMsg: object;
}

export class ErrorHandler {
  test: (e: any) => boolean;

  handler: () => void;

  constructor(test: (e: any) => boolean, handler: () => void) {
    this.test = test;
    this.handler = handler;
  }
}

export type Expiration =
  | {
      at_height: number;
    }
  | {
      at_time: number;
    }
  | 'nerver';

export type AccessLevel = 'approve_token' | 'all' | 'revoke_token' | 'none';
export interface Snip721Contract extends BaseContract {
  /**
   * returns the contract's name and symbol. This query is not authenticated.
   */
  getContractInfo(): any;

  /**
   * returns the number of tokens controlled by the contract.
   * If the contract's token supply is private, the SNIP-721 contract may choose to only allow an authenticated minter's address to perform this query.
   */
  getNumTokens(): any;

  /**
   * returns the owner of the specified token if the querier is the owner or has been granted permission to view the owner.
   * If the querier is the owner, OwnerOf must also display all the addresses that have been given transfer permission.
   * @param token_id ID of the token being queried
   * @param include_expired True if expired transfer approvals should be included in the response
   */
  getOwnerOf(token_id: string, include_expired?: boolean): any;

  /**
   * returns the public metadata of a token. All metadata fields are optional to allow for SNIP-721 contracts that choose not to implement metadata.
   * @param token_id ID of the token being queried
   */
  getNftInfo(token_id: string): any;

  /**
   * displays the result of both getOwnerOf and getNftInfo in a single query.
   * @param token_id ID of the token being queried
   * @param include_expired True if expired transfer approvals should be included in the response
   */
  getAllNftInfo(token_id: string, include_expired?: boolean): any;

  /**
   *returns the private metadata of a token if the querier is permitted to view it. 
    All metadata fields are optional to allow for SNIP-721 contracts that choose not to implement private metadata.
   * @param token_id ID of the token being queried
   */
  getPrivateMetadata(token_id: string): any;

  /**
   * returns all the information about a token that the viewer is permitted to view.
   * @param token_id ID of the token being queried
   * @param include_expired True if expired transfer approvals should be included in the response
   */
  getNftDossier(token_id: string, include_expired?: boolean): any;

  /**
   * returns whether the owner and private metadata of a token is public,
   * and lists all the approvals specific to this token. Only the token's owner may perform TokenApprovals.
   * @param token_id ID of the token being queried
   * @param include_expired True if expired transfer approvals should be included in the response
   */
  getTokenApprovals(token_id: string, include_expired?: boolean): any;

  /**
   * displays all the addresses that have approval to transfer all of the specified owner's tokens.
   * @param include_expired True if expired transfer approvals should be included in the response
   */
  getApprovedForAll(include_expired?: boolean): any;

  /**
   * returns whether all the address' tokens have public ownership and/or public display of private metadata, and lists all the inventory-wide approvals the address has granted.
   * @param include_expired True if expired transfer approvals should be included in the response
   */
  getInventoryApprovals(include_expired?: boolean): any;

  /**
   * displays an optionally paginated list of all the token IDs that belong to the specified owner. It must only display the owner's tokens on which the querier has view_owner permission.
   * @param owner The address whose inventory is being queried
   * @param start_after string	Results will only list token IDs that come after this token ID in the list
   * @param limit 	Number of token IDs to return
   */
  getTokens(owner: string, start_after?: string, limit?: number): any;

  /**
   * displays an optionally paginated list of transactions (mint, burn, and transfer) in reverse chronological order that involve the specified address.
   * @param page The page number to display, where the first transaction shown skips the page * page_size most recent transactions
   * @param page_size Number of transactions to return
   */
  getTransactionHistory(page?: number, page_size?: number): any;

  /**
   * is used to transfer ownership of the token to the recipient address.
   * @param recipient Address receiving the token
   * @param token_id Identifier of the token to be transferred
   * @param memo memo for the transfer transaction that is only viewable by addresses involved in the transfer (recipient, sender, previous owner)
   */
  transfer(recipient: string, token_id: string, memo?: string): any;

  /**
   * is used to transfer ownership of the token to the contract address, and then call the recipient's BatchReceiveNft if the recipient contract has registered its receiver interface with the NFT contract.
   * @param contract Address receiving the token
   * @param token_id Identifier of the token to be transferred
   * @param msg included when calling the recipient contract's BatchReceiveNft (or ReceiveNft)
   * @param memofor the transfer tx that is only viewable by addresses involved in the transfer (recipient, sender, previous owner)
   */
  send(contract: string, token_id: string, msg?: string, memo?: string): any;

  /**
   * is used to grant an address permission to transfer a single token.
   * @param spender Address being granted approval to transfer the token
   * @param token_id ID of the token that the spender can now transfer
   * @param expires The expiration of this token transfer approval. Can be a blockheight, time, or never
   */
  approve(spender: string, token_id: string, expires: Expiration): any;

  /**
   * is used to grant an address permission to transfer all the tokens in the message sender's inventory. This must include the ability to transfer any tokens the sender acquires after granting this inventory-wide approval.
   * @param operator Address being granted approval to transfer all of the message sender's tokens
   * @param expires 	The expiration of this inventory-wide transfer approval. Can be a blockheight, time, or never
   */
  approveAll(operator: string, expires: Expiration): any;

  /**
   * is used to revoke from an address the permission to transfer this single token.
   * @param spender Address no longer permitted to transfer the token
   * @param token_id ID of the token that the spender can no longer transfer
   */
  revoke(spender: string, token_id: string): any;

  /**
   * is used to revoke all transfer approvals granted to an address.
   * @param operator Address being revoked all approvals to transfer the message sender's tokens
   */
  revokeAll(operator: string): any;

  /**
   *The owner of a token can use SetWhitelistedApproval to grant an address permission to view ownership, view private metadata, and/or to transfer a single token or every token in the owner's inventory.

   * @param address Address to grant or revoke approval to/from
   * @param token_id If supplying either approve_token or revoke_token access, the token whose privacy is being set
   * @param view_owner Grant or revoke the address' permission to view the ownership of a token/inventory
   * @param view_private_metadata Grant or revoke the address' permission to view the private metadata of a token/inventory
   * @param transfer Grant or revoke the address' permission to transfer a token/inventory
   * @param expires The expiration of any approval granted in this message. Can be a blockheight, time, or never
   */
  setWhiteListedApproval(
    address: string,
    token_id?: string,
    view_owner?: AccessLevel,
    view_private_metadata?: AccessLevel,
    transfer?: AccessLevel,
    expires?: Expiration
  ): any;

  /**
   * A contract will use RegisterReceiveNft to notify the SNIP-721 contract that it implements ReceiveNft and possibly also BatchReceiveNft.
   * @param code_hash A 32-byte hex encoded string, with the code hash of the message sender, which is a contract that implements a receiver
   * @param also_implements_batch_receive_nft true if the message sender contract also implements BatchReceiveNft so it can be informed that it was sent a list of tokens
   */
  registerReceive(
    code_hash: string,
    also_implements_batch_receive_nft?: boolean
  ): any;

  /**
   * generates a new viewing key for the Cosmos message sender, which is used to authenticate account-specific queries, because queries in Cosmos have no way to cryptographically authenticate the querier's identity.
   */
  createViewingKey(): any;

  /**
   * is used to set the viewing key to a predefined string.
   * @param key The new viewing key for the message sender
   */
  setViewingKey(key: string): any;
}
