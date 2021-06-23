import { SigningCosmWasmClient, CosmWasmClient, Account } from 'secretjs';
import { Coin, StdFee } from 'secretjs/types/types.js';
import { Wallet } from './wallet';
export declare function generateEntropyString(length: number): string;
export declare function bech32(str: string, abbrv: number): string;
export declare class ScrtClient {
    readonly cosmWasmClient: CosmWasmClient;
    readonly signingCosmWasmClient: SigningCosmWasmClient;
    constructor(cosmWasmClient: CosmWasmClient, signingCosmWasmClient: SigningCosmWasmClient);
    queryContract(address: string, queryMsg: object): Promise<object>;
    executeContract(contractAddress: string, handleMsg: object, memo?: string, transferAmount?: readonly Coin[], fee?: StdFee): Promise<object>;
    getAccount(address: string): Promise<Account | undefined>;
}
export declare function createScrtClient(restUrl: string, wallet: Wallet): Promise<ScrtClient | undefined>;
