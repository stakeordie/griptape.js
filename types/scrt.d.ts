import { SigningCosmWasmClient } from 'secretjs';
import { Wallet } from './wallet';
export declare function createScrtClient(restUrl: string, wallet: Wallet): Promise<SigningCosmWasmClient>;
