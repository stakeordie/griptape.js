import {
  Context,
  ContractRequest,
  ContractDefinition,
  BaseContract,
} from '../contracts';

export interface Snip20Contract extends BaseContract {
  getBalance(): ContractRequest;
  getTokenInfo(): ContractRequest;
  getTransferHistory(page_size: number, page?: number): ContractRequest;
  getExchangeRate(): ContractRequest;
  transfer(recipient: string, amount: string): ContractRequest;
  send(recipient: string, amount: string, msg?: string): ContractRequest;
  registerReceived(code_hash: string): ContractRequest;
  createViewingKey(entropy: string): ContractRequest;
  setViewingKey(key: string): ContractRequest;
  deposit(): ContractRequest;
  redeem(amount: string, denom?: string): ContractRequest;
}

export const snip20Def: ContractDefinition = {
  queries: {
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

    getExchangeRate(): ContractRequest {
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
