import { Coin, StdFee } from 'secretjs/types/types.js';
export interface Context {
    address?: string;
    key?: string;
}
export interface ContractExecuteRequest {
    handleMsg: Record<string, unknown>;
    memo?: string;
    transferAmount?: readonly Coin[];
    fee?: StdFee;
}
export declare function createContract(contract: Record<string, unknown>): Record<string, any>;
