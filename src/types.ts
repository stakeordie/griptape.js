import { Wallet } from './wallet';
import { ScrtClient } from './wsecretjs';

export interface Queries {
  getBalance(address: string, key: string): Promise<void>;
}

export interface Messages {
  createViewingKey(): Promise<string>;
}

export interface ContractBaseDefinition {
  state: object;
  messages: object | Messages;
  queries: object | Queries;
}

export interface ContractDefinition extends ContractBaseDefinition {
  spec: 'base' | 'snip-20';
  contractAddress: string;
}

export interface Griptape {
  wallet: Wallet;
  scrtClient: ScrtClient;
}

export interface GriptapeConfig {
  restUrl: string;
  rpcUrl?: string;
  isExperimental: boolean;
}
