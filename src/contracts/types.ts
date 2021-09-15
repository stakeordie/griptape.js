import { Coin, StdFee } from 'secretjs/types/types.js';

export type ContractRequest = Record<string, unknown>;

export type ContractDefinition = {
  queries: any;
  messages: any;
};

export interface Context {
  address?: string;
  key?: string;
  padding?: string;
  height?: number;
  entropy?: string;
}

export interface ContractExecuteRequest {
  handleMsg: Record<string, unknown>;
  memo?: string;
  transferAmount?: readonly Coin[];
  fee?: StdFee;
}

export interface BaseContractProps {
  id: string;
  at: string;
}

export interface BaseContract extends BaseContractProps {}

export interface Snip20Contract extends BaseContract {
  getBalance(): ContractRequest;
  getTokenInfo(): ContractRequest;
  getTransferHistory(page_size: number, page?: number): ContractRequest;
  getMinters(): ContractRequest;
  getAllowance(owner: string, spender: string, key: string): ContractRequest;
  getExchangeRate(): ContractRequest;
  transfer(recipient: string, amount: string): ContractRequest;
  send(recipient: string, amount: string, msg?: string): ContractRequest;
  registerReceived(code_hash: string): ContractRequest;
  createViewingKey(entropy: string): ContractRequest;
  setViewingKey(key: string): ContractRequest;
  increaseAllowances(
    spender: string,
    amount: string,
    expiration?: number
  ): ContractRequest;
  decreaseAllowance(
    spender: string,
    amount: string,
    expiration?: number
  ): ContractRequest;
  transferFrom(
    owner: string,
    recipient: string,
    amount: string
  ): ContractRequest;
  sendFrom(
    owner: string,
    recipient: string,
    amount: string,
    msg?: string
  ): ContractRequest;
  mint(recipient: string, amount: string): ContractRequest;
  setMinters(minters: string[]): ContractRequest;
  burn(amount: string): ContractRequest;
  burnFrom(owner: string, amount: string): ContractRequest;
  deposit(): ContractRequest;
  redeem(amount: string, denom?: string): ContractRequest;
}

export interface ContractSpecification extends BaseContractProps {
  definition: ContractDefinition;
}

export class ErrorHandler {
  test: (e: any) => boolean;

  handler: () => void;

  constructor(test: (e: any) => boolean, handler: () => void) {
    this.test = test;
    this.handler = handler;
  }
}
