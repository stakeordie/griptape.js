import { Coin, StdFee } from 'secretjs/types/types.js';
import { ExecuteResult } from 'secretjs';
import { ViewingKeyManager } from './viewing-keys';
export interface Config {
    restUrl: string;
}
export interface AccountProvider {
    getAddress: () => string;
    getSigner: () => any;
    getSeed: () => any;
}
export declare type AccountProviderGetter = (chainId: string) => Promise<AccountProvider | undefined>;
export declare const viewingKeyManager: ViewingKeyManager;
export declare function getAddress(): string | undefined;
export declare function gripApp(restUrl: string, accountProviderGetter: AccountProviderGetter, runApp: () => void): Promise<void>;
export declare function bootstrap(): Promise<void>;
export declare function queryContract(address: string, queryMsg: Record<string, unknown>): Promise<Record<string, unknown>>;
export declare function executeContract(contractAddress: string, handleMsg: Record<string, unknown>, memo?: string, transferAmount?: readonly Coin[], fee?: StdFee): Promise<ExecuteResult>;
export declare function getKeplrAccountProvider(): AccountProviderGetter;
export declare function getChainId(): Promise<string>;
export declare function getHeight(): Promise<number>;
