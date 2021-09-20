import {
  Context,
  ContractRequest,
  ContractDefinition,
  AccessLevel,
  Expiration,
} from '../types';

export const snip721Def: ContractDefinition = {
  queries: {
    getContractInfo(): ContractRequest {
      return { contract_info: {} };
    },

    getNumTokens({ address, key: viewing_key }: Context): ContractRequest {
      const viewer = { address, viewing_key };
      return { num_tokens: { viewer } };
    },

    getOwnerOf(
      { address, key: viewing_key }: Context,
      token_id: string,
      include_expired?: boolean
    ): ContractRequest {
      const viewer = { address, viewing_key };
      return { owner_of: { token_id, viewer, include_expired } };
    },

    getNftInfo(_: Context, token_id: string): ContractRequest {
      return { nft_info: { token_id } };
    },

    getAllNftInfo(
      { address, key: viewing_key }: Context,
      token_id: string,
      include_expired?: boolean
    ): ContractRequest {
      const viewer = { address, viewing_key };
      return { all_nft_info: { token_id, viewer, include_expired } };
    },
    getPrivateMetadata(
      { address, key: viewing_key }: Context,
      token_id: string
    ): ContractRequest {
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
    ): ContractRequest {
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
    ): ContractRequest {
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
    ): ContractRequest {
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
    ): ContractRequest {
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
    ): ContractRequest {
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
    ): ContractRequest {
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
