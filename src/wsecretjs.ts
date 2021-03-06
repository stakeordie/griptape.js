import {
  SigningCosmWasmClient,
  CosmWasmClient,
  FeeTable,
  Account,
  ExecuteResult
} from 'secretjs';
import {
  Coin,
  StdFee
} from 'secretjs/types/types.js';
import { Wallet, getExperimentalConfig } from './wallet';
import axios, { AxiosInstance } from 'axios';
import { GriptapeConfig } from './types';

const decoder = new TextDecoder(); // encoding defaults to utf-8
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

export function generateEntropyString(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function bech32(str: string, abbrv: number): string {
  if (!str) return '';
  const half = (abbrv / 2) || 8;
  return str.substring(0, half) + '...'
    + str.substring(str.length - half, str.length);
}

function handleContractResponse(response: ExecuteResult): object {
  try {
    return JSON.parse(decoder.decode(response.data));
  } catch (e) {
    throw e;
  }
}

function toQueryString(params: any) {
  return Object.keys(params)
    .map((key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

const customFees: FeeTable = {
  upload: {
    amount: [{ amount: '2000000', denom: 'uscrt' }],
    gas: '2000000',
  },
  init: {
    amount: [{ amount: '500000', denom: 'uscrt' }],
    gas: '500000',
  },
  exec: {
    amount: [{ amount: '750000', denom: 'uscrt' }],
    gas: '750000',
  },
  send: {
    amount: [{ amount: '80000', denom: 'uscrt' }],
    gas: '80000',
  },
};

export class Result {

  private readonly data: any;

  constructor(data: any) {
    this.data = data;
  }

  get(): any {
    return decoder.decode(this.data);
  }

  parse(): object {
    try {
      return JSON.parse(decoder.decode(this.data));
    } catch (e) {
      throw e;
    }
  }
}

export class ScrtClient {

  readonly cosmWasmClient: CosmWasmClient;

  readonly signingCosmWasmClient?: SigningCosmWasmClient;

  readonly secretApi: AxiosInstance;

  constructor(cosmWasmClient: CosmWasmClient,
    secretApi: AxiosInstance,
    signingCosmWasmClient?: SigningCosmWasmClient) {
    this.cosmWasmClient = cosmWasmClient;
    this.secretApi = secretApi;

    if (signingCosmWasmClient) {
      this.signingCosmWasmClient = signingCosmWasmClient;
    }
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
  ): Promise<Result | undefined> {
    try {
      const response = await this.signingCosmWasmClient?.execute(
        contractAddress, handleMsg, memo, transferAmount, fee);
      return new Result(response?.data);
    } catch (e: any) {
      // TODO improve error handling here
      throw e;
    }
  }

  async getAccount(address: string): Promise<Account | undefined> {
    return await this.signingCosmWasmClient?.getAccount(address);
  }

  getProposals(params: { voter?: string, depositor?: string, status?: string; }): Promise<object> {
    const qs = toQueryString(params);
    return this.secretApi.get(`/gov/proposals?${qs}`);
  }

  createProposal(proposal: object): Promise<object> {
    return this.secretApi.post(`/gov/proposals`, proposal);
  }

  getProposalVotes(id: string): Promise<object> {
    return this.secretApi.get(`/gov/proposals/${id}/votes`);
  }

  voteProposal(id: string, vote: object): Promise<object> {
    return this.secretApi.post(`/gov/proposals/${id}/votes`, vote);
  }
}

export function createScrtClient(conf: GriptapeConfig, wallet: Wallet):
  Promise<ScrtClient | undefined> {
  const { restUrl, rpcUrl, isExperimental } = conf;

  return new Promise<ScrtClient | undefined>(async (resolve, reject) => {
    const cosmWasmClient = new CosmWasmClient(restUrl);
    const secretApi = axios.create({ baseURL: restUrl });
    const { keplr } = wallet;

    let chainId;
    try {
      chainId = await cosmWasmClient.getChainId();
    } catch (e) {
      resolve(new ScrtClient(cosmWasmClient, secretApi));
      return;
    }

    if (chainId) {
      try {
        // Enabling the wallet ASAP is recommended.
        if (isExperimental && rpcUrl) {
          const experimentalConfig = getExperimentalConfig({
            chainId,
            chainName: chainId,
            rest: restUrl,
            rpc: rpcUrl
          });
          await keplr.experimentalSuggestChain(experimentalConfig);
        }
        await keplr.enable(chainId);
      } catch (e) {
        resolve(new ScrtClient(cosmWasmClient, secretApi));
        return;
      }
    }

    // Set the chain id in the wallet.
    wallet.chainId = chainId;

    const address = await wallet.getAddress();
    const signer = await window?.getOfflineSigner!(chainId);
    const enigmaUtils = await wallet.keplr.getEnigmaUtils(chainId);

    const signingCosmWasmClient = new SigningCosmWasmClient(
      // @ts-ignore
      restUrl, address, signer, enigmaUtils, customFees);
    const scrtClient =
      new ScrtClient(cosmWasmClient, secretApi, signingCosmWasmClient);
    resolve(scrtClient);
  });
}
