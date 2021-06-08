import { SigningCosmWasmClient, CosmWasmClient } from 'secretjs';
import { Coin, StdFee } from 'secretjs/types/types.js';
import { Wallet } from './wallet';
export declare class ScrtClient {
    readonly cosmWasmClient: CosmWasmClient;
    readonly signingCosmWasmClient: SigningCosmWasmClient;
    constructor(cosmWasmClient: CosmWasmClient, signingCosmWasmClient: SigningCosmWasmClient);
    queryContract(address: string, queryMsg: object): Promise<object>;
    executeContract(contractAddress: string, handleMsg: object, memo?: string, transferAmount?: readonly Coin[], fee?: StdFee): Promise<object>;
}
export declare function createScrtClient(restUrl: string, wallet: Wallet): Promise<ScrtClient>;
