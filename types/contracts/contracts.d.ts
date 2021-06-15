import { ScrtClient } from '../scrt';
export interface Snip20Contract {
    address: string;
    state: object;
    createViewingKey(): Promise<string>;
}
export interface GrippedSnip20Contract extends Snip20Contract {
    scrtClient: ScrtClient;
}
export declare function injectDependencies(contract: Snip20Contract, scrtClient: ScrtClient): GrippedSnip20Contract;
export declare function createSnip20Contract(address: string): Snip20Contract;
