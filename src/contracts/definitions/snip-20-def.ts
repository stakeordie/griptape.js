import {
  BaseContract,
  Context,
  ContractDefinition,
  ContractQueryRequest,
  Snip20Contract,
} from '../types';

export const snip20Def: ContractDefinition = {
  queries: {
    getBalance({ address, key }: Context): ContractQueryRequest {
      return { balance: { address, key } };
    },

    getTokenInfo(): ContractQueryRequest {
      return { token_info: {} };
    },

    getTransferHistory(
      { address, key }: Context,
      page_size: number,
      page?: number
    ): ContractQueryRequest {
      return { transfer_history: { address, key, page_size, page } };
    },

    getMinters(): ContractQueryRequest {
      return { minters: {} };
    },

    getAllowance(
      _: Context,
      owner: string,
      spender: string,
      key: string
    ): ContractQueryRequest {
      return { allowance: { owner, spender, key } };
    },

    getExchangeRate(): ContractQueryRequest {
      return { exchange_rate: {} };
    },
  },

  messages: {
    transfer({ padding }: Context, recipient: string, amount: string) {
      const handleMsg = {
        transfer: { recipient, amount, padding },
      };
      return { handleMsg };
    },

    send(
      { padding }: Context,
      recipient: string,
      amount: string,
      msg?: string
    ) {
      const handleMsg = {
        send: { recipient, amount, msg, padding },
      };
      return { handleMsg };
    },

    registerReceive({ padding }: Context, code_hash: string) {
      const handleMsg = {
        register_receive: { code_hash, padding },
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

    increaseAllowances(
      { padding }: Context,
      spender: string,
      amount: string,
      expiration?: number
    ) {
      const handleMsg = {
        increase_allowance: { spender, amount, expiration, padding },
      };
      return { handleMsg };
    },

    decreaseAllowance(
      { padding }: Context,
      spender: string,
      amount: string,
      expiration?: number
    ) {
      const handleMsg = {
        decrease_allowance: { spender, amount, expiration, padding },
      };
      return { handleMsg };
    },

    transferFrom(
      { padding }: Context,
      owner: string,
      recipient: string,
      amount: string
    ) {
      const handleMsg = {
        transfer_from: { owner, recipient, amount, padding },
      };
      return { handleMsg };
    },

    sendFrom(
      { padding }: Context,
      owner: string,
      recipient: string,
      amount: string,
      msg?: string
    ) {
      const handleMsg = {
        send_from: { owner, recipient, amount, msg, padding },
      };
      return { handleMsg };
    },

    mint({ padding }: Context, recipient: string, amount: string) {
      const handleMsg = {
        mint: { recipient, amount, padding },
      };
      return { handleMsg };
    },

    setMinters({ padding }: Context, minters: string[]) {
      const handleMsg = {
        set_minters: { minters, padding },
      };
      return { handleMsg };
    },

    burn({ padding }: Context, amount: string) {
      const handleMsg = {
        burn: { amount, padding },
      };
      return { handleMsg };
    },

    burnFrom({ padding }: Context, owner: string, amount: string) {
      const handleMsg = {
        burn_from: { owner, amount, padding },
      };
      return { handleMsg };
    },

    deposit({ padding }: Context) {
      const handleMsg = {
        deposit: { padding },
      };
      return { handleMsg };
    },

    redeem({ padding }: Context, amount: string, denom?: string) {
      const handleMsg = {
        redeem: { amount, denom, padding },
      };
      return { handleMsg };
    },
  },
};
