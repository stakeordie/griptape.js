import { Wallet, getWallet } from './wallet';
import { createScrtClient, ScrtClient } from './scrt';

export * from './utils/scrt';

export interface Griptape {
  wallet: Wallet
  scrtClient: ScrtClient
}

export interface Contract {
  createViewingKey(): Promise<string>
  setAddress(address: string): void
  setScrtClient(scrtClient: ScrtClient): void
}

export interface ContractConfig {
  address: string
  instance: Contract
}

export interface GriptapeConfig {
  restUrl: string
  contract: ContractConfig
}

export function grip(conf: GriptapeConfig): Promise<Griptape> {
  return new Promise<Griptape>(async (resolve, reject) => {
    try {
      const wallet = await getWallet();
      const scrtClient = await createScrtClient(conf.restUrl, wallet);
      const griptape = { wallet, scrtClient } as Griptape;
      resolve(griptape);
    } catch (e) {
      reject(e);
    }
  });
}
