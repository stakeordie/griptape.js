import { TxResponse, Coin } from 'secretjs';

export interface Context {
  address?: string;
  key?: string;
  padding?: string;
  withHeight(
    callback: (height: number) => Record<string, unknown>
  ): Record<string, unknown>;
  entropy?: string;
  permit?: Record<string, unknown>;
  contractAddress: string;
}

export interface ContractMessageResponse<T> {
  parse(): T;
  getRaw(): TxResponse;
  isEmpty(): boolean;
}

export type ContractQueryRequest = Record<string, Record<string, any>>;

export interface ContractMessageRequest {
  handleMsg: Record<string, unknown>;
  memo?: string;
  transferAmount?: Coin;
  fees?: number;
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
  id?: string;
  at: string;
  codeHash?: string;
}

export interface BaseContract extends BaseContractProps {}

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

export type MessageEntry = {
  contractAddress: string;
  handleMsg: object;
  transferAmount?: Coin[] | undefined;
};

export type MessageGetter = (
  ...args: any[]
) => Promise<ContractMessageResponse<unknown>>;

export interface MultiMessageInfo {
  getMessage: (...args: unknown[]) => ContractMessageRequest;
  contract: BaseContract;
  args: unknown[];
}
