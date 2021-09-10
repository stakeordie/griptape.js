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
  getExchangeRate(): ContractRequest;
  transfer(recipient: string, amount: string): ContractRequest;
  send(recipient: string, amount: string, msg?: string): ContractRequest;
  registerReceived(code_hash: string): ContractRequest;
  createViewingKey(entropy: string): ContractRequest;
  setViewingKey(key: string): ContractRequest;
  deposit(): ContractRequest;
  redeem(amount: string, denom?: string): ContractRequest;
}

export interface ContractSpecification extends BaseContractProps {
  definition: ContractDefinition;
}

export enum ContractError {
  OutOfGas,
  KeplrRejected,
}
