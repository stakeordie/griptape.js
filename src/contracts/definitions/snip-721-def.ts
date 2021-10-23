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

    getNumTokens({ address, key: viewing_key }: Context): ContractQueryRequest {
      const viewer = { address, viewing_key };
      return { num_tokens: { viewer } };
    },

    getOwnerOf(
      { address, key: viewing_key }: Context,
      token_id: string,
      include_expired?: boolean
    ): ContractQueryRequest {
      const viewer = { address, viewing_key };
      return { owner_of: { token_id, viewer, include_expired } };
    },

    getNftInfo(_: Context, token_id: string): ContractQueryRequest {
      return { nft_info: { token_id } };
    },

    getAllNftInfo(
      { address, key: viewing_key }: Context,
      token_id: string,
      include_expired?: boolean
    ): ContractQueryRequest {
      const viewer = { address, viewing_key };
      return { all_nft_info: { token_id, viewer, include_expired } };
    },

    getPrivateMetadata(
      { address, key: viewing_key }: Context,
      token_id: string
    ): ContractQueryRequest {
      const viewer = { viewing_key, address };
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
      include_expired?: boolean
    ): ContractQueryRequest {
      const viewer = { viewing_key, address };
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
      { address: owner }: Context,
      include_expired?: boolean
    ): ContractQueryRequest {
      return {
        approved_for_all: {
          owner,
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
      { address: viewer }: Context,
      owner: string,
      start_after?: string,
      limit?: number
    ): ContractQueryRequest {
      return {
        tokens: {
          viewer,
          owner,
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
  },
};

export type Expiration =
  | {
      at_height: number;
    }
  | {
      at_time: number;
    }
  | 'never';

export type AccessLevel = 'approve_token' | 'all' | 'revoke_token' | 'none';

export type Approval = {
  spender: string;
  expires: Expiration;
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
  displa_type?: string;
  trait_type?: string;
  value?: string;
  max_value?: string;
};

export interface Snip721Contract extends BaseContract {
  /**
   * Returns the contract's name and symbol. This query is not authenticated.
   */
  getContractInfo(): Promise<{
    contract_info: { name: string; symbol: string };
  }>;

  /**
   * Returns the number of tokens controlled by the contract. If the contract's
   * token supply is private, the SNIP-721 contract may choose to only allow an
   * authenticated minter's address to perform this query.
   */
  getNumTokens(): Promise<{ num_tokens: { count: number } }>;

  /**
   * Returns the owner of the specified token if the querier is the owner or has
   * been granted permission to view the owner. If the querier is the owner,
   * `OwnerOf` must also display all the addresses that have been given transfer
   * permission.
   * @param token_id ID of the token being queried.
   * @param include_expired True if expired transfer approvals should be
   * included in the response.
   */
  getOwnerOf(
    token_id: string,
    include_expired?: boolean
  ): Promise<{
    owner_of: {
      owner: string;
      approvals: Approval[];
    };
  }>;

  /**
   * Returns the public metadata of a token. All metadata fields are optional to
   * allow for SNIP-721 contracts that choose not to implement metadata.
   * @param token_id ID of the token being queried.
   */
  getNftInfo(token_id: string): Promise<{
    nft_info: {
      name: string;
      description: string;
      image: string;
    };
  }>;

  /**
   * Displays the result of both getOwnerOf and getNftInfo in a single query.
   * @param token_id ID of the token being queried.
   * @param include_expired True if expired transfer approvals should be
   * included in the response.
   */
  getAllNftInfo(
    token_id: string,
    include_expired?: boolean
  ): Promise<{
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
  }>;

  /**
   * Returns the private metadata of a token if the querier is permitted to view
   * it. All metadata fields are optional to allow for SNIP-721 contracts that
   * choose not to implement private metadata.
   * @param token_id ID of the token being queried.
   */
  getPrivateMetadata(token_id: string): Promise<{
    private_metadata: {
      token_uri?: string;
      extension?: Extension;
    };
  }>;

  /**
   * Returns all the information about a token that the viewer is permitted to
   * view.
   * @param token_id ID of the token being queried.
   * @param include_expired True if expired transfer approvals should be
   * included in the response.
   */
  getNftDossier(
    token_id: string,
    include_expired?: boolean
  ): Promise<{
    nft_dossier: {
      owner: string;
      public_metadata: {
        token_uri?: string;
        extension?: Extension;
      };
      private_metadata: {
        token_uri?: string;
        extension?: Extension;
      };
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
  }>;

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
  ): Promise<{
    token_approvals: {
      token_id: string;
      viewing_key: string;
      include_expired: boolean;
    };
  }>;

  /**
   * Displays all the addresses that have approval to transfer all of the
   * specified owner's tokens.
   * @param include_expired True if expired transfer approvals should be
   * included in the response
   */
  getApprovedForAll(include_expired?: boolean): {
    approved_for_all: {
      operators: {
        spender: string;
        expires: string;
      }[];
    };
  };

  /**
   * Returns whether all the address' tokens have public ownership and/or public
   * display of private metadata, and lists all the inventory-wide approvals the
   * address has granted.
   * @param include_expired True if expired transfer approvals should be
   * included in the response.
   */
  getInventoryApprovals(include_expired?: boolean): Promise<{
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
  }>;

  /**
   * Displays an optionally paginated list of all the token IDs that belong to
   * the specified owner. It must only display the owner's tokens on which the
   * querier has view_owner permission.
   * @param owner The address whose inventory is being queried.
   * @param start_after string	Results will only list token IDs that come after
   * this token ID in the list.
   * @param limit 	Number of token IDs to return.
   */
  getTokens(
    owner: string,
    start_after?: string,
    limit?: number
  ): Promise<{
    token_list: {
      tokens: string[];
    };
  }>;

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
  ): Promise<{
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
  }>;

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
}
