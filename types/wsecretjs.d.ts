import { SigningCosmWasmClient, CosmWasmClient, Account } from 'secretjs';
import { Coin, StdFee } from 'secretjs/types/types.js';
import { Wallet } from './wallet';
import { AxiosInstance } from 'axios';
import { GriptapeConfig } from './types';
export declare function generateEntropyString(length: number): string;
export declare function bech32(str: string, abbrv: number): string;
export declare class Result {
    private readonly data;
    constructor(data: any);
    get(): any;
    parse(): object;
}
export declare class ScrtClient {
    readonly cosmWasmClient: CosmWasmClient;
    readonly signingCosmWasmClient?: SigningCosmWasmClient;
    readonly secretApi: AxiosInstance;
    constructor(cosmWasmClient: CosmWasmClient, secretApi: AxiosInstance, signingCosmWasmClient?: SigningCosmWasmClient);
    queryContract(address: string, queryMsg: object): Promise<object>;
    executeContract(contractAddress: string, handleMsg: object, memo?: string, transferAmount?: readonly Coin[], fee?: StdFee): Promise<Result | undefined>;
    getAccount(address: string): Promise<Account | undefined>;
    getProposals(params: {
        voter?: string;
        depositor?: string;
        status?: string;
    }): Promise<object>;
    createProposal(proposal: object): Promise<object>;
    getProposalVotes(id: string): Promise<object>;
    voteProposal(id: string, vote: object): Promise<object>;
}
export declare function createScrtClient(conf: GriptapeConfig, wallet: Wallet): Promise<ScrtClient | undefined>;
