import {
  SigningCosmWasmClient,
  CosmWasmClient,
} from 'secretjs';

import { Coin, StdFee } from 'secretjs/types/types.js';

import { Wallet } from './wallet';
import { handleContractResponse } from './utils/scrt';

const customFees = {
  upload: {
    amount: [{ amount: "2000000", denom: "uscrt" }],
    gas: "2000000",
  },
  init: {
    amount: [{ amount: "500000", denom: "uscrt" }],
    gas: "500000",
  },
  exec: {
    amount: [{ amount: "750000", denom: "uscrt" }],
    gas: "750000",
  },
  send: {
    amount: [{ amount: "80000", denom: "uscrt" }],
    gas: "80000",
  },
}

export class ScrtClient {

  readonly cosmWasmClient: CosmWasmClient;

  readonly signingCosmWasmClient: SigningCosmWasmClient;

  constructor(cosmWasmClient: CosmWasmClient, signingCosmWasmClient: SigningCosmWasmClient) {
    this.cosmWasmClient = cosmWasmClient;
    this.signingCosmWasmClient = signingCosmWasmClient;
  }

  async queryContract(address: string, queryMsg: object): Promise<object> {
    return await this.cosmWasmClient.queryContractSmart(address, queryMsg);
  }

  async executeContract(
    contractAddress: string,
    handleMsg: object,
    memo?: string,
    transferAmount?: readonly Coin[],
    fee?: StdFee
  ): Promise<object> {
    try {
      const response = await this.signingCosmWasmClient.execute(contractAddress, handleMsg, memo, transferAmount, fee);
      return handleContractResponse(response);
    } catch(e: any) {
      // TODO improve error handling here
      throw e;
    }
  }
}

export function createScrtClient(restUrl: string, wallet: Wallet): Promise<ScrtClient> {
  return new Promise<ScrtClient>(async (resolve, reject) => {
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
    const signingCosmWasmClient = new SigningCosmWasmClient(restUrl, address, signer, enigmaUtils, customFees);

    const scrtClient = new ScrtClient(cosmWasmClient, signingCosmWasmClient);

    resolve(scrtClient);
  });
}
