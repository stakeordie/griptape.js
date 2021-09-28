import { ExecuteResult } from 'secretjs';
import { Coin, StdFee } from 'secretjs/types/types.js';

export interface Context {
  address?: string;
  key?: string;
  padding?: string;
  height?: number;
  entropy?: string;
}

export interface ContractMessageResponse<T> {
  parse(): T;
  getRaw(): ExecuteResult;
  isEmpty(): boolean;
}

export type ContractQueryRequest = Record<string, Record<string, any>>;

export interface ContractMessageRequest {
  handleMsg: Record<string, unknown>;
  memo?: string;
  transferAmount?: readonly Coin[];
  fee?: number;
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
