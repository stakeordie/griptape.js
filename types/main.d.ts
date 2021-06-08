import { Wallet } from './wallet';
import { ScrtClient } from './scrt';
export * from './utils/scrt';
export interface Griptape {
    wallet: Wallet;
    scrtClient: ScrtClient;
}
export interface Contract {
    createViewingKey(): Promise<string>;
    setAddress(address: string): void;
    setScrtClient(scrtClient: ScrtClient): void;
}
export interface ContractConfig {
    address: string;
    instance: Contract;
}
export interface GriptapeConfig {
    restUrl: string;
    contract: ContractConfig;
}
export declare function grip(conf: GriptapeConfig): Promise<Griptape>;
