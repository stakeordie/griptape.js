import { getKeplr } from './wallet';
import { Coin, StdFee } from 'secretjs/types/types.js';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
  ExecuteResult,
  FeeTable,
  BroadcastMode,
} from 'secretjs';
import { KeplrViewingKeyManager, ViewingKeyManager } from './viewing-keys';
import { emitEvent } from './events';
import { getWindow } from './utils';

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

export { BroadcastMode };

export interface Config {
  restUrl: string;
  broadcastMode?: BroadcastMode;
}

export interface AccountProvider {
  getAddress: () => string;
  getSigner: () => any;
  getSeed: () => any;
}

export type AccountProviderGetter = (
  chainId: string
) => Promise<AccountProvider | undefined>;

let config: Config | undefined;
let client: CosmWasmClient | undefined;
let signingClient: SigningCosmWasmClient | undefined;
let accountAvailable = false;
let getProvider: AccountProviderGetter | undefined;

export let provider: AccountProvider | undefined;

export const viewingKeyManager = new ViewingKeyManager();
export const keplrViewingKeyManager = new KeplrViewingKeyManager(
  viewingKeyManager
);

export function getConfig(): Config | undefined {
  return config;
}

export function getAddress(): string | undefined {
  return provider?.getAddress();
}

export function isAccountAvailable() {
  return accountAvailable;
}

export async function gripApp(
  _config: string | Config,
  accountProviderGetter: AccountProviderGetter,
  runApp: () => void
): Promise<void> {
  if (!config) {
    // Set the configuration.
    if (typeof _config === 'string') {
      config = { restUrl: _config, broadcastMode: BroadcastMode.Sync };
    } else {
      _config.broadcastMode = _config.broadcastMode ?? BroadcastMode.Sync;
      config = _config;
    }

    // `CosmWasmClient` should be created first.
    await initClient();

    // Run the app.
    runApp();

    // Current chain ID.
    const chainId = await getChainId();

    // Set the provider.
    getProvider = accountProviderGetter;

    const connected = localStorage.getItem('connected');
    if (connected == null) {
      emitEvent('account-not-available');
      throw new Error('Not connected yet');
    }

    provider = await getProvider(chainId);

    // At this point we have an account available...
    emitEvent('account-available');

    accountAvailable = true;

    // `SigningCosmWasmClient` should be created later.
    await initSigningClient();
  }
}

async function initClient(): Promise<void> {
  if (client) return;
  if (!config) throw new Error('No configuration was set');
  client = new CosmWasmClient(config.restUrl);
}

async function initSigningClient(): Promise<void> {
  if (signingClient) return;
  if (!config) throw new Error('No configuration was set');
  if (!client) throw new Error('No client available');
  if (!provider) throw new Error('No provider available');

  const { restUrl } = config;

  if (!provider) return;

  const address = provider.getAddress();
  const signer = provider.getSigner();
  const seed = provider.getSeed();
  const broadcastMode = config.broadcastMode;

  signingClient = new SigningCosmWasmClient(
    // @ts-ignore
    restUrl,
    address,
    signer,
    seed,
    customFees,
    broadcastMode
  );
}

export async function bootstrap(): Promise<void> {
  if (!getProvider) throw new Error('No provider available');
  await initClient();
  const chainId = await getChainId();
  provider = await getProvider(chainId);
  emitEvent('account-available');
  accountAvailable = true;
  await initSigningClient();
  localStorage.setItem('connected', 'connected');
}

// Copy of bootstrap without triggering the onAccountAvailable event
async function reloadSigningClient(): Promise<void> {
  const chainId = await getChainId();

  provider = await getKeplrAccountProviderInternal(chainId, false);
  accountAvailable = true;
  await initSigningClient();
}

export function shutdown() {
  const connected = localStorage.getItem('connected');
  if (!connected) return;
  emitEvent('shutdown');
  localStorage.removeItem('connected');
}

// TODO Move this to `contracts.ts`
export function queryContract(
  address: string,
  queryMsg: Record<string, unknown>,
  addedParams?: Record<string, unknown>,
  codeHash?: string
): Promise<Record<string, unknown>> {
  if (!client) throw new Error('No client available');
  return client.queryContractSmart(address, queryMsg, addedParams, codeHash);
}

// TODO Move this to `contracts.ts`
export async function executeContract(
  contractAddress: string,
  handleMsg: Record<string, unknown>,
  memo?: string,
  transferAmount?: readonly Coin[],
  fee?: StdFee,
  codeHash?: string
): Promise<ExecuteResult> {
  if (!signingClient) throw new Error('No signing client available');
  return signingClient.execute(
    contractAddress,
    handleMsg,
    memo,
    transferAmount,
    fee,
    codeHash
  );
}
export let accountChangedCallback: () => void;

// So this is a very rough implementation of an Account provider.
// This is not the way it suppose to be, but for now will do the trick.
// This will require a refactor at some point.
async function getKeplrAccountProviderInternal(
  chainId: string,
  keplrEnabled = true
): Promise<AccountProvider | undefined> {
  const keplr = await getKeplr();

  if (!keplr || !getWindow()?.getOfflineSigner)
    throw new Error('Install keplr extension');

  try {
    // Enabling keplr is recommended. But is not what I like...
    await keplr.enable(chainId);
  } catch (e) {
    return;
  }

  const offlineSigner = getWindow()?.getOfflineSigner!(chainId);
  if (!offlineSigner) throw new Error('No offline signer');
  const [{ address }] = await offlineSigner.getAccounts();
  const enigmaUtils = keplr.getEnigmaUtils(chainId);

  if (keplrEnabled) {
    // And also we want to be able to react to an account change.
    accountChangedCallback = async () => {
      await reloadSigningClient();
      emitEvent('account-change');
    };
    getWindow()?.addEventListener(
      'keplr_keystorechange',
      accountChangedCallback
    );
  }
  return {
    getAddress: () => address,
    getSigner: () => offlineSigner,
    getSeed: () => enigmaUtils,
  };
}

export function getKeplrAccountProvider(): AccountProviderGetter {
  return async (chainId: string) => {
    return await getKeplrAccountProviderInternal(chainId);
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

export function instantiate(codeId: number, initMsg: object, label: string) {
  if (!signingClient) throw new Error('No signing client available');
  return signingClient.instantiate(codeId, initMsg, label);
}

export function getContracts(codeId: number): Promise<
  readonly {
    readonly address: string;
    readonly codeId: number;
    readonly creator: string;
    readonly label: string;
  }[]
> {
  if (!client) throw new Error('No client available');
  return client?.getContracts(codeId);
}

export function getClient() {
  if (!client) throw new Error('No client available');
  return client;
}

export function getSigningClient() {
  if (!signingClient) throw new Error('No singing client available');
  return signingClient;
}

export async function getNativeCoinBalance(): Promise<string> {
  if (!client) throw new Error('No client available');
  const address = getAddress();
  if (!address) throw new Error('No address available');
  const account = await client.getAccount(address);
  if (!account) throw new Error('No account exiting on chain');
  if (account.balance.length == 0) return '0';
  return account.balance[0].amount;
}
