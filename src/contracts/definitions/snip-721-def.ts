import { extendContract } from '..';
import { ContractQueryResponse } from '../types';
import {
  Context,
  ContractQueryRequest,
  ContractDefinition,
  BaseContract,
  ContractMessageResponse,
} from '../types';

export const snip721Def: ContractDefinition = {
  queries: {
    getContractInfo(): ContractQueryRequest {
      return { contract_info: {} };
    },

    getNumTokens(
      { address, key: viewing_key }: Context,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const viewer = sendViewer ? { address, viewing_key } : null;

      return { num_tokens: { viewer } };
    },

    getOwnerOf(
      { address, key: viewing_key }: Context,
      token_id: string,
      include_expired?: boolean,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const viewer = sendViewer ? { address, viewing_key } : null;
      return { owner_of: { token_id, viewer, include_expired } };
    },

    getNftInfo(_: Context, token_id: string): ContractQueryRequest {
      return { nft_info: { token_id } };
    },

    getAllNftInfo(
      { address, key: viewing_key }: Context,
      token_id: string,
      include_expired?: boolean,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const viewer = sendViewer ? { address, viewing_key } : null;
      return { all_nft_info: { token_id, viewer, include_expired } };
    },

    getPrivateMetadata(
      { address, key: viewing_key }: Context,
      token_id: string,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const viewer = sendViewer ? { address, viewing_key } : null;

      return {
        private_metadata: {
          token_id,
          viewer,
        },
      };
    },

    getNftDossier(
      { address, key: viewing_key }: Context,
      token_id: string,
      include_expired?: boolean,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const viewer = sendViewer ? { address, viewing_key } : null;
      return {
        nft_dossier: {
          token_id,
          viewer,
          include_expired,
        },
      };
    },

    getTokenApprovals(
      { key: viewing_key }: Context,
      token_id: string,
      include_expired?: boolean
    ): ContractQueryRequest {
      return {
        token_approvals: {
          token_id,
          viewing_key,
          include_expired,
        },
      };
    },

    getApprovedForAll(
      { address: owner, key }: Context,
      include_expired?: boolean,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const viewing_key = sendViewer ? key : null;
      return {
        approved_for_all: {
          owner,
          viewing_key,
          include_expired,
        },
      };
    },

    getInventoryApprovals(
      { address, key: viewing_key }: Context,
      include_expired?: boolean
    ): ContractQueryRequest {
      return {
        inventory_approvals: {
          address,
          viewing_key,
          include_expired,
        },
      };
    },

    getTokens(
      { address: owner, key }: Context,
      viewer?: string,
      start_after?: string,
      limit?: number,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const viewing_key = sendViewer ? key : null;
      return {
        tokens: {
          owner,
          viewer,
          viewing_key,
          start_after,
          limit,
        },
      };
    },

    getTransactionHistory(
      { address, key: viewing_key }: Context,
      page?: number,
      page_size?: number
    ): ContractQueryRequest {
      return {
        transaction_history: {
          address,
          viewing_key,
          page,
          page_size,
        },
      };
    },

    getAllTokens(
      { address, key: viewing_key }: Context,
      limit?: number,
      sendViewer?: boolean
    ) {
      const viewer = sendViewer ? { address, viewing_key } : null;
      return { all_tokens: { viewer, limit } };
    },

    getMinters(_: Context) {
      return { minters: {} };
    },

    getRoyaltyInfo(_: Context, token_id?: string) {
      return { royalty_info: { token_id } };
    },

    getIsUnwrapped(_: Context, token_id: string) {
      return { is_unwrapped: { token_id } };
    },

    getVerifyTransferApproval(
      { address, key: viewing_key }: Context,
      token_ids: Array<string>
    ) {
      return { verify_transfer_approval: { token_ids, address, viewing_key } };
    },
  },

  messages: {
    transfer(
      { padding }: Context,
      recipient: string,
      token_id: string,
      memo?: string
    ) {
      const handleMsg = {
        transfer_nft: { recipient, token_id, memo, padding },
      };

      return { handleMsg };
    },

    send(
      { padding }: Context,
      contract: string,
      token_id: string,
      msg?: string,
      memo?: string
    ) {
      const handleMsg = {
        send_nft: { contract, token_id, msg, memo, padding },
      };
      return { handleMsg };
    },

    approve(
      { padding }: Context,
      spender: string,
      token_id: string,
      expires: Expiration
    ) {
      const handleMsg = {
        approve: { spender, token_id, expires, padding },
      };
      return { handleMsg };
    },

    approveAll({ padding }: Context, operator: string, expires: Expiration) {
      const handleMsg = {
        approve_all: { operator, expires, padding },
      };
      return { handleMsg };
    },

    revoke({ padding }: Context, spender: string, token_id: string) {
      const handleMsg = {
        revoke: { spender, token_id, padding },
      };
      return { handleMsg };
    },

    revokeAll({ padding }: Context, operator: string) {
      const handleMsg = {
        revoke_all: { operator, padding },
      };
      return { handleMsg };
    },

    setWhiteListedApproval(
      { padding }: Context,
      address: string,
      token_id?: string,
      view_owner?: AccessLevel,
      view_private_metadata?: AccessLevel,
      transfer?: AccessLevel,
      expires?: Expiration
    ) {
      const handleMsg = {
        set_whitelisted_approval: {
          address,
          token_id,
          view_owner,
          view_private_metadata,
          transfer,
          expires,
          padding,
        },
      };
      return { handleMsg };
    },

    registerReceive(
      { padding }: Context,
      code_hash: string,
      also_implements_batch_receive_nft?: boolean
    ) {
      const handleMsg = {
        register_receive_nft: {
          code_hash,
          also_implements_batch_receive_nft,
          padding,
        },
      };
      return { handleMsg };
    },

    createViewingKey({ padding, entropy }: Context) {
      const handleMsg = {
        create_viewing_key: { entropy, padding },
      };
      return { handleMsg };
    },

    setViewingKey({ padding }: Context, key: string) {
      const handleMsg = {
        set_viewing_key: { key, padding },
      };
      return { handleMsg };
    },

    mintNft(
      { address, padding }: Context,
      token_id?: string,
      owner?: string,
      public_metadata?: Metadata,
      private_metadata?: Metadata,
      serial_number?: SerialNumber,
      royalty_info?: RoyaltyInfo,
      memo?: string
    ) {
      const handleMsg = {
        mint_nft: {
          token_id,
          owner: owner || address,
          public_metadata,
          private_metadata,
          serial_number,
          royalty_info,
          memo,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    mintNftClones(
      { address, padding }: Context,
      quantity: number,
      mint_run_id?: string,
      owner?: string,
      public_metadata?: Metadata,
      private_metadata?: Metadata,
      royalty_info?: RoyaltyInfo,
      memo?: string
    ) {
      const handleMsg = {
        mint_nft_clones: {
          mint_run_id,
          quantity,
          owner: owner || address,
          public_metadata,
          private_metadata,
          royalty_info,
          memo,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    addMinters({ padding }: Context, minters: Array<string>) {
      const handleMsg = {
        add_minters: {
          minters,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    removeMinters({ padding }: Context, minters: Array<string>) {
      const handleMsg = {
        remove_minters: {
          minters,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    setMinters({ padding }: Context, minters: Array<string>) {
      const handleMsg = {
        set_minters: {
          minters,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    setMetadata(
      { padding }: Context,
      token_id: string,
      public_metadata?: Metadata,
      private_metadata?: Metadata
    ) {
      const handleMsg = {
        set_metadata: {
          token_id,
          public_metadata,
          private_metadata,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    setRoyaltyInfo(
      { padding }: Context,
      token_id?: string,
      royalty_info?: RoyaltyInfo
    ) {
      const handleMsg = {
        set_royalty_info: {
          token_id,
          royalty_info,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    batchMintNft({ padding }: Context, mints: Array<Mint>) {
      const handleMsg = {
        batch_mint_nft: {
          mints,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    batchTransferNft({ padding }: Context, transfers: Array<Transfer>) {
      const handleMsg = {
        batch_transfer_nft: {
          transfers,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    batchSendNft({ padding }: Context, sends: Array<Send>) {
      const handleMsg = {
        batch_send_nft: {
          sends,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    burnNft({ padding }: Context, token_id: string, memo?: string) {
      const handleMsg = {
        burn_nft: {
          token_id,
          memo,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    BurnNft({ padding }: Context, burns: Array<Burn>) {
      const handleMsg = {
        batch_burn_nft: {
          burns,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    setGlobalApproval(
      { padding }: Context,
      token_id: string,
      view_owner?: AccessLevel,
      view_private_metadata?: AccessLevel,
      expires?: Expiration
    ) {
      const handleMsg = {
        set_global_approval: {
          token_id,
          view_owner,
          view_private_metadata,
          expires,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },

    reveal({ padding }: Context, token_id: string) {
      const handleMsg = {
        reveal: {
          token_id,
          padding,
        },
      };
      return {
        handleMsg,
      };
    },
  },
};

const snip721BasePermitDef: ContractDefinition = {
  queries: {
    getNumTokens(
      { permit }: Context,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const query = { num_tokens: {} };

      if (!sendViewer) return query;

      return { with_permit: { query, permit } };
    },

    getOwnerOf(
      { permit }: Context,
      token_id: string,
      include_expired?: boolean,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const query = { owner_of: { token_id, include_expired } };

      if (!sendViewer) return query;

      return { with_permit: { query, permit } };
    },

    getAllNftInfo(
      { permit }: Context,
      token_id: string,
      include_expired?: boolean,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const query = { all_nft_info: { token_id, include_expired } };

      if (!sendViewer) return query;

      return { with_permit: { query, permit } };
    },

    getPrivateMetadata(
      { permit }: Context,
      token_id: string,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const query = {
        private_metadata: {
          token_id,
        },
      };

      if (!sendViewer) return query;

      return { with_permit: { query, permit } };
    },

    getNftDossier(
      { permit }: Context,
      token_id: string,
      include_expired?: boolean,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const query = {
        nft_dossier: {
          token_id,
          include_expired,
        },
      };
      if (!sendViewer) return query;

      return { with_permit: { query, permit } };
    },

    getTokenApprovals(
      { permit }: Context,
      token_id: string,
      include_expired?: boolean
    ): ContractQueryRequest {
      const query = {
        token_approvals: {
          token_id,
          include_expired,
        },
      };

      return { with_permit: { query, permit } };
    },

    getApprovedForAll(
      { address: owner, permit }: Context,
      include_expired?: boolean,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const query = {
        approved_for_all: {
          owner,
          include_expired,
        },
      };

      if (!sendViewer) return query;

      return { with_permit: { query, permit } };
    },

    getInventoryApprovals(
      { address, permit }: Context,
      include_expired?: boolean
    ): ContractQueryRequest {
      const query = {
        inventory_approvals: {
          address,
          include_expired,
        },
      };

      return { with_permit: { query, permit } };
    },

    getTokens(
      { address: owner, permit }: Context,
      viewer?: string,
      start_after?: string,
      limit?: number,
      sendViewer?: boolean
    ): ContractQueryRequest {
      const query = {
        tokens: {
          owner,
          viewer,
          start_after,
          limit,
        },
      };

      if (!sendViewer) return query;

      return { with_permit: { query, permit } };
    },

    getTransactionHistory(
      { address, permit }: Context,
      page?: number,
      page_size?: number
    ): ContractQueryRequest {
      const query = {
        transaction_history: {
          address,
          page,
          page_size,
        },
      };

      return { with_permit: { query, permit } };
    },

    getAllTokens({ permit }: Context, limit?: number, sendViewer?: boolean) {
      const query = { all_tokens: { limit } };

      if (!sendViewer) return query;

      return { with_permit: { query, permit } };
    },

    getVerifyTransferApproval({ permit }: Context, token_ids: Array<string>) {
      const query = { verify_transfer_approval: { token_ids } };

      return { with_permit: { query, permit } };
    },
  },
};

export const snip721PermitDef = extendContract(
  snip721Def,
  snip721BasePermitDef
);

export type Expiration =
  | {
      at_height: number;
    }
  | {
      at_time: number;
    }
  | 'never';

export type AccessLevel = 'approve_token' | 'all' | 'revoke_token' | 'none';
export type Transfer = {
  recipient: string;
  token_ids: Array<string>;
  memo?: string;
};
export type ReceiverInfo = {
  recipient_code_hash: string;
  also_implements_batch_receive_nft?: boolean;
};
export type Send = {
  contract: string;
  receiver_info?: ReceiverInfo;
  token_ids: Array<string>;
  msg?: string;
  memo?: string;
};
export type Burn = {
  token_ids: Array<string>;
  memo?: string;
};
export type SerialNumber = {
  mint_run?: number;
  serial_number: number;
  quantity_minted_this_run?: number;
};
export type Approval = {
  spender: string;
  expires: Expiration;
};
export type Metadata = {
  token_uri?: string;
  extension?: Extension;
};
export type RoyaltyInfo = {
  decimal_places_in_rates: number;
  royalties: Array<{
    recipient: string;
    rate: number;
  }>;
};
export type Mint = {
  token_id?: string;
  owner?: string;
  public_metadata?: Metadata;
  private_metadata?: Metadata;
  serial_number?: SerialNumber;
  royalty_info?: RoyaltyInfo;
  memo?: string;
};
export type Extension = {
  image?: string;
  image_data?: string;
  external_uri?: string;
  description?: string;
  name?: string;
  attributes?: Trait[];
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
  media?: Media[];
  protected_attributes?: string[];
};

export type Media = {
  file_type?: string;
  extension?: string;
  authentication?: {
    key?: string;
    user?: string;
  };
  url?: string;
};

export type Trait = {
  display_type?: string;
  trait_type?: string;
  value?: string;
  max_value?: string;
};

export interface Snip721Contract extends BaseContract {
  /**
   * Returns the contract's name and symbol. This query is not authenticated.
   */
  getContractInfo(): Promise<
    ContractQueryResponse<{
      contract_info: { name: string; symbol: string };
    }>
  >;

  /**
   * Returns the number of tokens controlled by the contract. If the contract's
   * token supply is private, the SNIP-721 contract may choose to only allow an
   * authenticated minter's address to perform this query.
   * @param sendViewer optional boolean for authenticating with a viewer, false as default
   */
  getNumTokens(
    sendViewer?: boolean
  ): Promise<ContractQueryResponse<{ num_tokens: { count: number } }>>;

  /**
   * Returns the owner of the specified token if the querier is the owner or has
   * been granted permission to view the owner. If the querier is the owner,
   * `OwnerOf` must also display all the addresses that have been given transfer
   * permission.
   * @param token_id ID of the token being queried.
   * @param include_expired True if expired transfer approvals should be
   * @param sendViewer optional boolean for authenticating with a viewer, false as default
   * included in the response.
   */
  getOwnerOf(
    token_id: string,
    include_expired?: boolean,
    sendViewer?: boolean
  ): Promise<
    ContractQueryResponse<{
      owner_of: {
        owner: string;
        approvals: Approval[];
      };
    }>
  >;

  /**
   * Returns the public metadata of a token. All metadata fields are optional to
   * allow for SNIP-721 contracts that choose not to implement metadata.
   * @param token_id ID of the token being queried.
   */
  getNftInfo(token_id: string): Promise<
    ContractQueryResponse<{
      nft_info: {
        name: string;
        description: string;
        image: string;
      };
    }>
  >;

  /**
   * Displays the result of both getOwnerOf and getNftInfo in a single query.
   * @param token_id ID of the token being queried.
   * @param include_expired True if expired transfer approvals should be
   * included in the response.
   * @param sendViewer optional boolean for authenticating with a viewer, false as default
   */
  getAllNftInfo(
    token_id: string,
    include_expired?: boolean,
    sendViewer?: boolean
  ): Promise<
    ContractQueryResponse<{
      all_nft_info: {
        access: {
          owner: string;
          approvals: Approval[];
        };
        info: {
          name: string;
          description: string;
          image: string;
        };
      };
    }>
  >;

  /**
   * Returns the private metadata of a token if the querier is permitted to view
   * it. All metadata fields are optional to allow for SNIP-721 contracts that
   * choose not to implement private metadata.
   * @param token_id ID of the token being queried.
   * @param sendViewer optional boolean for authenticating with a viewer, false as default
   */
  getPrivateMetadata(
    token_id: string,
    sendViewer?: boolean
  ): Promise<
    ContractQueryResponse<{
      private_metadata: Metadata;
    }>
  >;

  /**
   * Returns all the information about a token that the viewer is permitted to
   * view.
   * @param token_id ID of the token being queried.
   * @param include_expired True if expired transfer approvals should be
   * @param sendViewer optional boolean for authenticating with a viewer, false as default
   * included in the response.
   */
  getNftDossier(
    token_id: string,
    include_expired?: boolean,
    sendViewer?: boolean
  ): Promise<
    ContractQueryResponse<{
      nft_dossier: {
        owner: string;
        public_metadata: Metadata;
        private_metadata: Metadata;
        display_private_metadata_error: string;
        royalty_info: {
          decimal_places_in_rates: number;
          royalties: {
            recipient: string;
            rate: number;
          }[];
        };
        mint_run_info: {
          collection_creator: string;
          token_creator: string;
          time_of_minting: number;
          mint_run: number;
          serial_number: number;
          quantity_minted_this_run: number;
        };
        owner_is_public: boolean;
        public_ownership_expiration: Expiration;
        private_metadata_is_public: boolean;
        private_metadata_is_public_expiration: Expiration;
        token_approvals: {
          address: string;
          view_owner_expiration: Expiration;
          view_private_metadata_expiration: Expiration;
          transfer_expiration: Expiration;
        }[];
        inventory_approvals: {
          address: string;
          view_owner_expiration: Expiration;
          view_private_metadata_expiration: Expiration;
          transfer_expiration: Expiration;
        }[];
      };
    }>
  >;

  /**
   * Returns whether the owner and private metadata of a token is public, and
   * lists all the approvals specific to this token. Only the token's owner
   * may perform TokenApprovals.
   * @param token_id ID of the token being queried
   * @param include_expired True if expired transfer approvals should be
   * included in the response.
   */
  getTokenApprovals(
    token_id: string,
    include_expired?: boolean
  ): Promise<
    ContractQueryResponse<{
      token_approvals: {
        token_id: string;
        viewing_key: string;
        include_expired: boolean;
      };
    }>
  >;

  /**
   * Displays all the addresses that have approval to transfer all of the
   * specified owner's tokens.
   * @param include_expired True if expired transfer approvals should be
   * @param sendViewer optional boolean for authenticating with a viewer, false as default
   * included in the response
   */
  getApprovedForAll(include_expired?: boolean): Promise<
    ContractQueryResponse<{
      approved_for_all: {
        operators: {
          spender: string;
          expires: string;
        }[];
      };
    }>
  >;

  /**
   * Returns whether all the address' tokens have public ownership and/or public
   * display of private metadata, and lists all the inventory-wide approvals the
   * address has granted.
   * @param include_expired True if expired transfer approvals should be
   * included in the response.
   */
  getInventoryApprovals(include_expired?: boolean): Promise<
    ContractQueryResponse<{
      inventory_approvals: {
        owner_is_public: boolean;
        public_ownership_expiration: string;
        private_metadata_is_public: boolean;
        private_metadata_is_public_expiration: string;
        inventory_approvals: {
          address: string;
          view_owner_expiration: string;
          view_private_metadata_expiration: string;
          transfer_expiration: string;
        }[];
      };
    }>
  >;

  /**
   * Displays an optionally paginated list of all the token IDs that belong to
   * the specified owner. It must only display the owner's tokens on which the
   * querier has view_owner permission.
   * @param owner The address whose inventory is being queried.
   * @param start_after string	Results will only list token IDs that come after
   * this token ID in the list.
   * @param limit 	Number of token IDs to return.
   * @param sendViewer optional boolean for authenticating with a viewer, false as default
   */
  getTokens(
    owner: string,
    start_after?: string,
    limit?: number,
    sendViewer?: boolean
  ): Promise<
    ContractQueryResponse<{
      token_list: {
        tokens: string[];
      };
    }>
  >;

  /**
   * Displays an optionally paginated list of transactions
   * (mint, burn, and transfer) in reverse chronological order that involve the
   * specified address.
   * @param page The page number to display, where the first transaction shown
   * skips the page * page_size most recent transactions.
   * @param page_size Number of transactions to return.
   */
  getTransactionHistory(
    page?: number,
    page_size?: number
  ): Promise<
    ContractQueryResponse<{
      transaction_history: {
        total: number;
        txs: {
          tx_id: number;
          block_height: number;
          block_time: number;
          token_id: string;
          action: {
            transfer?: {
              from: string;
              sender: string;
              recipient: string;
            };
            mint?: {
              minter: string;
              recipient: string;
            };
            burn?: {
              owner: string;
              burner: string;
            };
          };
          memo: string;
        }[];
      };
    }>
  >;

  /**
   * Returns a list of tokens' ids minted in order minted. Only if the token supply is public
   * @param limit 	Number of token IDs to return.
   * @param sendViewer optional boolean for authenticating with a viewer, false as default
   */
  getAllTokens(
    limit?: number,
    sendViewer?: boolean
  ): Promise<
    ContractQueryResponse<{
      token_list: {
        tokens: Array<string>;
      };
    }>
  >;

  /**
   * Minters returns the list of addresses that are authorized to mint tokens. This query is not authenticated.
   */
  getMinters(): Promise<
    ContractQueryResponse<{
      minters: {
        minters: Array<string>;
      };
    }>
  >;

  /**
   * If a token_id is provided in the request, RoyaltyInfo returns the royalty information for that token.
   * If no token_id is requested, RoyaltyInfo displays the default royalty information for the contract.
   * @param token_id ID of the token being queried
   */
  getRoyaltyInfo(token_id?: string): Promise<
    ContractQueryResponse<{
      royalty_info: RoyaltyInfo;
    }>
  >;

  /**
   * IsUnwrapped indicates whether the token has been unwrapped. This query is not authenticated.
   * @param token_id ID of the token being queried
   */
  getIsUnwrapped(token_id: string): Promise<
    ContractQueryResponse<{
      is_unwrapped: {
        token_is_unwrapped: boolean;
      };
    }>
  >;

  /**
   * VerifyTransferApproval will verify that the specified address has approval
   * to transfer the entire provided list of tokens.
   * @param token_ids Array of IDs of the tokens to verify
   */
  getVerifyTransferApproval(token_ids: Array<string>): Promise<
    ContractQueryResponse<{
      verify_transfer_approval: {
        approved_for_all: boolean;
        first_unapproved_token: string;
      };
    }>
  >;

  /**
   * Is used to transfer ownership of the token to the recipient address.
   * @param recipient Address receiving the token.
   * @param token_id Identifier of the token to be transferred.
   * @param memo memo for the transfer transaction that is only viewable by
   * addresses involved in the transfer (recipient, sender, previous owner).
   */
  transfer(
    recipient: string,
    token_id: string,
    memo?: string
  ): Promise<
    ContractMessageResponse<{
      transfer_nft: {
        status: string;
      };
    }>
  >;

  /**
   * Is used to transfer ownership of the token to the contract address, and
   * then call the recipient's BatchReceiveNft if the recipient contract has
   * registered its receiver interface with the NFT contract.
   * @param contract Address receiving the token.
   * @param token_id Identifier of the token to be transferred.
   * @param msg Included when calling the recipient contract's BatchReceiveNft
   * (or ReceiveNft).
   * @param memofor The transfer tx that is only viewable by addresses involved
   * in the transfer (recipient, sender, previous owner)
   */
  send(
    contract: string,
    token_id: string,
    msg?: string,
    memo?: string
  ): Promise<
    ContractMessageResponse<{
      send_nft: {
        status: string;
      };
    }>
  >;

  /**
   * Is used to grant an address permission to transfer a single token.
   * @param spender Address being granted approval to transfer the token.
   * @param token_id ID of the token that the spender can now transfer.
   * @param expires The expiration of this token transfer approval. Can be a
   * blockheight, time, or never.
   */
  approve(
    spender: string,
    token_id: string,
    expires: Expiration
  ): Promise<
    ContractMessageResponse<{
      approve: {
        status: string;
      };
    }>
  >;

  /**
   * Is used to grant an address permission to transfer all the tokens in the
   * message sender's inventory. This must include the ability to transfer any
   * tokens the sender acquires after granting this inventory-wide approval.
   * @param operator Address being granted approval to transfer all of the
   * message sender's tokens.
   * @param expires The expiration of this inventory-wide transfer approval.
   * Can be a blockheight, time, or never.
   */
  approveAll(
    operator: string,
    expires: Expiration
  ): Promise<
    ContractMessageResponse<{
      approve_all: {
        status: string;
      };
    }>
  >;

  /**
   * Is used to revoke from an address the permission to transfer this single
   * token.
   * @param spender Address no longer permitted to transfer the token.
   * @param token_id ID of the token that the spender can no longer transfer.
   */
  revoke(
    spender: string,
    token_id: string
  ): Promise<
    ContractMessageResponse<{
      revoke: {
        status: string;
      };
    }>
  >;

  /**
   * Is used to revoke all transfer approvals granted to an address.
   * @param operator Address being revoked all approvals to transfer the message
   * sender's tokens.
   */
  revokeAll(operator: string): Promise<
    ContractMessageResponse<{
      revoke_all: {
        status: string;
      };
    }>
  >;

  /**
   * The owner of a token can use SetWhitelistedApproval to grant an address
   * permission to view ownership, view private metadata, and/or to transfer a
   * single token or every token in the owner's inventory.
   * @param address Address to grant or revoke approval to/from.
   * @param token_id If supplying either approve_token or revoke_token access,
   * the token whose privacy is being set.
   * @param view_owner Grant or revoke the address' permission to view the
   * ownership of a token/inventory.
   * @param view_private_metadata Grant or revoke the address' permission to
   * view the private metadata of a token/inventory.
   * @param transfer Grant or revoke the address' permission to transfer a
   * token/inventory.
   * @param expires The expiration of any approval granted in this message. Can
   * be a blockheight, time, or never.
   */
  setWhiteListedApproval(
    address: string,
    token_id?: string,
    view_owner?: AccessLevel,
    view_private_metadata?: AccessLevel,
    transfer?: AccessLevel,
    expires?: Expiration
  ): Promise<
    ContractMessageResponse<{
      set_whitelisted_approval: {
        status: string;
      };
    }>
  >;

  /**
   * A contract will use RegisterReceiveNft to notify the SNIP-721 contract that
   * it implements ReceiveNft and possibly also BatchReceiveNft.
   * @param code_hash A 32-byte hex encoded string, with the code hash of the
   * message sender, which is a contract that implements a receiver
   * @param also_implements_batch_receive_nft True if the message sender
   * contract also implements BatchReceiveNft so it can be informed that it was
   * sent a list of tokens
   */
  registerReceive(
    code_hash: string,
    also_implements_batch_receive_nft?: boolean
  ): Promise<
    ContractMessageResponse<{
      register_receive_nft: {
        status: string;
      };
    }>
  >;

  /**
   * Generates a new viewing key for the Cosmos message sender, which is used to
   * authenticate account-specific queries, because queries in Cosmos have no
   * way to cryptographically authenticate the querier's identity.
   */
  createViewingKey(): Promise<
    ContractMessageResponse<{
      viewing_key: {
        key: string;
      };
    }>
  >;

  /**
   * Is used to set the viewing key to a predefined string.
   * @param key The new viewing key for the message sender.
   */
  setViewingKey(key: string): Promise<
    ContractMessageResponse<{
      viewing_key: {
        key: string;
      };
    }>
  >;
  /**
   * mints a single token.
   * @param token_id optional_ID_of_new_token,
   * @param public_metadata optional public object of type Metadata to set for a token
   * @param private_metadata optional private object of type Metadata to set for a token
   * @param serial_number optional SerialNumber for this token
   * @param royalty_info optional RoyaltyInfo for this token
   * @param memo memo for the mint tx that is only viewable by addresses involved in the mint (minter, owner)
   */
  mintNft(
    token_id?: string,
    owner?: string,
    public_metadata?: Metadata,
    private_metadata?: Metadata,
    serial_number?: SerialNumber,
    royalty_info?: RoyaltyInfo,
    memo?: string
  ): Promise<
    ContractMessageResponse<{
      mint_nft: {
        token_id: string;
      };
    }>
  >;

  /**
   * MintNftClones mints copies of an NFT, giving each one a MintRunInfo that indicates
   * its serial number and the number of identical NFTs minted with it.
   * @param token_id optional_ID_of_new_token,
   * @param quantity number of clones to mint in this run
   * @param public_metadata optional public object of type Metadata to set for a token
   * @param private_metadata optional private object of type Metadata to set for a token
   * @param serial_number optional SerialNumber for this token
   * @param royalty_info optional RoyaltyInfo for this token
   * @param memo memo for the mint tx that is only viewable by addresses involved in the mint (minter, owner)
   */
  mintNftClones(
    quantity: number,
    mint_run_id?: string,
    owner?: string,
    public_metadata?: Metadata,
    private_metadata?: Metadata,
    royalty_info?: RoyaltyInfo,
    memo?: string
  ): Promise<
    ContractMessageResponse<{
      mint_nft_clones: {
        first_minted: string;
        last_minted: string;
      };
    }>
  >;

  /**
   * AddMinters must add the provided addresses to the list of authorized minters.
   * This should only be callable by an admin address.
   * @param minters list of addresses to add
   */
  addMinters(minters: Array<string>): Promise<
    ContractMessageResponse<{
      add_minters: {
        status: string;
      };
    }>
  >;

  /**
   * RemoveMinters must remove the provided addresses from the list of authorized minters.
   * This should only be callable by an admin address.
   * @param minters list of addresses to remove
   */
  removeMinters(minters: Array<string>): Promise<
    ContractMessageResponse<{
      remove_minters: {
        status: string;
      };
    }>
  >;

  /**
   * SetMinters must precisely define the list of authorized minters. This should
   * only be callable by an admin address.
   * @param minters list of addresses to set
   */
  setMinters(minters: Array<string>): Promise<
    ContractMessageResponse<{
      set_minters: {
        status: string;
      };
    }>
  >;

  /**
   * SetMetadata will set the public and/or private metadata to the corresponding input.
   * @param token_id ID of the token whose metadata should be updated,
   * @param public_metadata optional public object of type Metadata to set for a token
   * @param private_metadata optional private object of type Metadata to set for a token
   */
  setMetadata(
    token_id: string,
    public_metadata?: Metadata,
    private_metadata?: Metadata
  ): Promise<
    ContractMessageResponse<{
      set_metadata: {
        status: string;
      };
    }>
  >;

  /**
   * The contract's default RoyaltyInfo is the RoyaltyInfo that will be assigned
   * to any token that is minted without explicitly defining its own RoyaltyInfo.
   * [more info](https://github.com/SecretFoundation/SNIPs/blob/master/SNIP-721.md#setroyaltyinfo)
   * @param token_id Optional ID of the token whose RoyaltyInfo should be updated
   * @param royalty_info The new RoyaltyInfo
   */
  setRoyaltyInfo(
    token_id?: string,
    royalty_info?: RoyaltyInfo
  ): Promise<
    ContractMessageResponse<{
      set_royalty_info: {
        status: string;
      };
    }>
  >;

  /**
   * BatchMintNft mints a list of tokens.
   * @param mints A list of all the mint operations to perform
   */
  batchMintNft(mints: Array<Mint>): Promise<
    ContractMessageResponse<{
      batch_mint_nft: {
        token_ids: Array<string>;
      };
    }>
  >;

  /**
   * BatchTransferNft is used to perform multiple token transfers.
   * @param transfers List of Transfer objects to process
   */
  batchTransferNft(transfers: Array<Transfer>): Promise<
    ContractMessageResponse<{
      batch_transfer_nft: {
        status: string;
      };
    }>
  >;

  /**
   * BatchSendNft is used to perform multiple token transfers
   * [more info](https://github.com/SecretFoundation/SNIPs/blob/master/SNIP-721.md#batchsendnft)
   *
   * @param sends List of Send objects to process
   */
  batchSendNft(sends: Array<Send>): Promise<
    ContractMessageResponse<{
      batch_send_nft: {
        status: string;
      };
    }>
  >;

  /**
   * BurnNft is used to burn a single token, providing an optional memo to include
   * in the burn's transaction history if desired.
   * @param token_id Identifier of the token to burn
   * @param memo memo for the burn tx that is only viewable by addresses involved in the burn
   */
  burnNft(
    token_id: string,
    memo?: string
  ): Promise<
    ContractMessageResponse<{
      burn_nft: {
        status: string;
      };
    }>
  >;

  /**
   * The Burn object provides a list of tokens to burn, as well as an optional
   * memo that would be included with every token burn transaction history.
   * @param burns List of Burn objects to process
   */
  BurnNft(burns: Array<Burn>): Promise<
    ContractMessageResponse<{
      batch_burn_nft: {
        status: string;
      };
    }>
  >;

  /**
   * The owner of a token can use SetGlobalApproval to make ownership and/or private metadata viewable by everyone
   * @param token_id If supplying either approve_token or revoke_token access, the token whose privacy is being set
   * @param view_owner Grant or revoke everyone's permission to view the ownership of a token/inventory
   * @param view_private_metadata Grant or revoke everyone's permission to view the private metadata of a token/inventory
   * @param expires Expiration of any approval granted in this message. Can be a blockheight, time, or never
   */
  setGlobalApproval(
    token_id: string,
    view_owner?: AccessLevel,
    view_private_metadata?: AccessLevel,
    expires?: Expiration
  ): Promise<
    ContractMessageResponse<{
      set_global_approval: {
        status: string;
      };
    }>
  >;

  /**
   * Reveal unwraps the sealed private metadata, irreversibly marking the token as unwrapped.
   * @param token_id ID of the token to unwrap
   */
  reveal(token_id: string): Promise<
    ContractMessageResponse<{
      reveal: {
        status: string;
      };
    }>
  >;
}
