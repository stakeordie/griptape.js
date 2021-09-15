import {
  Context,
  ContractRequest,
  ContractDefinition,
  BaseContract,
  Snip20Contract,
} from '../types';

export const snip20Def: ContractDefinition = {
  queries: {
    //Base
    getBalance({ address, key }: Context): ContractRequest {
      return { balance: { address, key } };
    },

    getTokenInfo(): ContractRequest {
      return { token_info: {} };
    },

    getTransferHistory(
      { address, key }: Context,
      page_size: number,
      page?: number
    ): ContractRequest {
      return { transfer_history: { address, key, page_size, page } };
    },

    //Mintable
    getMinters(): ContractRequest {
      return { minters: {} };
    },

    //Alowance
    getAllowance(owner: string, spender: string, key: string): ContractRequest {
      return { allowance: { owner, spender, key } };
    },

    //Native
    getExchangeRate(): ContractRequest {
      return { exchange_rate: {} };
    },
  },

  messages: {
    //Base
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

    createViewingKey({ padding }: Context, entropy: string) {
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

    //Alowances
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

    //Mintable
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

    //Native
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
