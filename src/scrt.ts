import {
  SigningCosmWasmClient,
  CosmWasmClient,
  Account,
  FeeTable,
  IndexedTx,
  TxsResponse,
  ExecuteResult
} from 'secretjs';

import { Wallet } from './wallet';

export function createScrtClient(restUrl: string, wallet: Wallet): Promise<SigningCosmWasmClient> {
  return new Promise<SigningCosmWasmClient>(async (resolve, reject) => {
    const cosmWasmClient = new CosmWasmClient(restUrl);
    const { keplr } = wallet;

    const chainId = await cosmWasmClient.getChainId();

    // Set the chain id in the wallet
    wallet.chainId = chainId;

    try {
      await keplr.enable(chainId);
    } catch (e) {
      reject(e);
      return;
    }

    const address = await wallet.getAddress();
    const signer = await window?.getOfflineSigner!(chainId);
    const enigmaUtils = await wallet.keplr.getEnigmaUtils(chainId);

    // @ts-ignore
    const client = new SigningCosmWasmClient(restUrl, address, signer, enigmaUtils);

    resolve(client);
  });
}
