import { getKeplr } from './wallet';
import {
  Coin,
  StdFee
} from 'secretjs/types/types.js';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
  ExecuteResult,
  FeeTable
} from 'secretjs';
import { ViewingKeyManager } from './viewing-keys';

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

export interface Config {
  restUrl: string;
}

export interface AccountProvider {
  getAddress: () => string
  getSigner: () => any
  getSeed: () => any
}

export type AccountProviderGetter = (chainId: string)
                                     => Promise<AccountProvider | undefined>

let config: Config | undefined;
let client: CosmWasmClient | undefined;
let signingClient: SigningCosmWasmClient | undefined;
let getProvider: AccountProviderGetter | undefined;

export class Griptape {

  address?: string

  isConnected = false

  onConnect(callback: () => void): Griptape {
    window.addEventListener('connected', callback);
    return this;
  }

  onConnectAndAlways(callback: () => void): Griptape {
    if (!this.isConnected) {
      return this.onConnect(callback);
    } else {
      callback();
    }
    return this;
  }

  onInit(callback: () => void): Griptape {
    window.addEventListener('init', callback);
    return this;
  }
}

export const griptape = new Griptape();
export const viewingKeyManager = new ViewingKeyManager();

function emitEvent(
  name: string,
  options: Record<string, unknown> = { bubbles: true, cancelable: true }
) {
    const event = new Event(name, options);
    document.dispatchEvent(event);
}

export async function gripApp(
  restUrl: string,
  accountProviderGetter: AccountProviderGetter,
  runApp: () => void): Promise<void> {

  if (!config) {
    getProvider = accountProviderGetter;
    config = { restUrl };
    await initClient();
    runApp();
    await initSigningClient();
    emitEvent('connected');
    griptape.isConnected = true;
    emitEvent('init');
  }
}

function initClient(): void {
  if (client) return;
  if (!config) throw new Error('No configuration was set');
  client = new CosmWasmClient(config.restUrl);
}

async function initSigningClient(): Promise<void> {
  if (signingClient) return;
  if (!config) throw new Error('No configuration was set');
  if (!client) throw new Error('No client available');
  if (!getProvider) throw new Error('No provider available');

  const { restUrl } = config;
  const chainId = await client.getChainId();
  const provider = await getProvider(chainId);

  if (!provider) throw new Error('Could not initialize provider');

  const address = provider.getAddress();
  const signer = provider.getSigner();
  const seed = provider.getSeed();

  // Hacking the system
  griptape.address = address;
  viewingKeyManager.address = address;

  signingClient = new SigningCosmWasmClient(
    // @ts-ignore
    restUrl, address, signer, seed, customFees);
}

export async function bootstrap(): Promise<void> {
  if (!config) throw new Error('No configuration was set');
  initClient();
  await initSigningClient();
  emitEvent('connected');
}

// TODO Move this to `contracts.ts`
export function queryContract(
  address: string,
  queryMsg: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (!client) throw new Error('No client available');
  return client.queryContractSmart(address, queryMsg);
}

// TODO Move this to `contracts.ts`
export async function executeContract(
  contractAddress: string,
  handleMsg: Record<string, unknown>,
  memo?: string,
  transferAmount?: readonly Coin[],
  fee?: StdFee
): Promise<ExecuteResult> {
  if (!signingClient) await initSigningClient();
  if (!signingClient) throw new Error('No signing client available');
  return signingClient.execute(
    contractAddress, handleMsg, memo, transferAmount, fee);
}

export function getKeplrAccountProvider(): AccountProviderGetter {
  return async (chainId: string) => {
    const keplr = await getKeplr();

    if (!keplr || !window.getOfflineSigner)
      throw new Error('Install keplr extension');

    // Enabling keplr is recommended
    await keplr.enable(chainId);

    const offlineSigner = window.getOfflineSigner(chainId);
    const [{ address }] = await offlineSigner.getAccounts();
    const enigmaUtils = await keplr.getEnigmaUtils(chainId);

    return {
      getAddress: () => address,
      getSigner: () => offlineSigner,
      getSeed: () => enigmaUtils
    };
  };
}

export function getChainId(): Promise<string> {
  if (!client) throw new Error('No client available');
  return client.getChainId();
}

export function getHeight(): Promise<number> {
  if (!client) throw new Error('No client available');
  return client.getHeight();
}
