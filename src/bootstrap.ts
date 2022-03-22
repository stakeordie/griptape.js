import { getKeplr } from './wallet';
import {
  SecretNetworkClient,
  Tx,
  Coin,
  MsgExecuteContractParams,
  BroadcastMode,
  MsgInstantiateContractParams,
  QueryContractsByCodeResponse,
  TxOptions,
} from 'secretjs';
import {
  KeplrViewingKeyManager,
  ViewingKeyManager,
  PermitManager,
} from './auth/index';
import { emitEvent } from './events';
import { getWindow } from './utils';
import { QueryBalanceResponse } from 'secretjs/dist/protobuf_stuff/cosmos/bank/v1beta1/query';
import { StdFee } from 'secretjs/dist/wallet_amino';

export { BroadcastMode };

export interface DefaultFees {
  upload?: number;
  init?: number;
  exec?: number;
  send?: number;
}

export interface Config {
  restUrl: string;
  chainId?: string;
  broadcastMode?: BroadcastMode;
  defaultFees?: DefaultFees;
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
let client: SecretNetworkClient | undefined;
let signingClient: SecretNetworkClient | undefined;
let accountAvailable = false;
let getProvider: AccountProviderGetter | undefined;

export let provider: AccountProvider | undefined;

export const viewingKeyManager = new ViewingKeyManager();
export const keplrViewingKeyManager = new KeplrViewingKeyManager(
  viewingKeyManager
);

export const permitManager = new PermitManager();

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

    let chainId = config.chainId;

    if (!chainId) {
      chainId = await getChainId();
    }
    // Set the provider.
    getProvider = accountProviderGetter;

    const connected = localStorage.getItem('connected');
    if (connected == null) {
      emitEvent('account-not-available');
      return;
    }

    provider = await getProvider(chainId);
    accountAvailable = true;

    // At this point we have an account available...
    emitEvent('account-available');

    // `SigningCosmWasmClient` should be created later.
    await initSigningClient();
  }
}

async function initClient(): Promise<void> {
  if (client) return;
  if (!config) throw new Error('No configuration was set');
  client = await SecretNetworkClient.create({ grpcWebUrl: config.restUrl });
}

async function initSigningClient(): Promise<void> {
  if (!config) throw new Error('No configuration was set');
  if (!client) throw new Error('No client available');
  if (!provider) throw new Error('No provider available');

  const { restUrl } = config;

  if (!provider) return;

  const address = provider.getAddress();
  const signer = provider.getSigner();
  const seed = provider.getSeed();
  const chainId = await getChainId();

  signingClient = await SecretNetworkClient.create({
    grpcWebUrl: restUrl,
    wallet: signer,
    walletAddress: address,
    chainId: chainId,
    encryptionUtils: seed,
  });
}

export async function bootstrap(): Promise<void> {
  if (!getProvider) throw new Error('No provider available');
  await initClient();
  const chainId = await getChainId();
  provider = await getProvider(chainId);
  accountAvailable = true;
  emitEvent('account-available');
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
  accountAvailable = false;
  emitEvent('shutdown');
  localStorage.removeItem('connected');
}

// TODO Move this to `contracts.ts`
export async function queryContract(
  address: string,
  query: Record<string, unknown>,
  _addedParams?: Record<string, unknown>,
  codeHash?: string
): Promise<Record<string, unknown>> {
  if (!client) throw new Error('No client available');
  return await client.query.compute.queryContract({
    address,
    query,
    codeHash,
  });
}

// TODO Move this to `contracts.ts`
export async function executeContract(
  contract: string,
  msg: Record<string, unknown>,
  memo?: string,
  sentFunds?: Coin[],
  fee?: StdFee,
  codeHash?: string
): Promise<Tx> {
  if (!signingClient) throw new Error('No signing client available');

  const executeContract: MsgExecuteContractParams = {
    sender: signingClient.address,
    contract,
    msg,
    sentFunds: sentFunds || [],
    codeHash,
  };
  const txOptions: TxOptions = {
    memo,
    gasLimit: parseInt(
      fee?.gas || config?.defaultFees?.exec?.toString() || '30000'
    ),
    broadcastMode: config?.broadcastMode || BroadcastMode.Sync,
  };

  return await signingClient.tx.compute.executeContract(
    executeContract,
    txOptions
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

  if (!keplr || !getWindow()?.getOfflineSignerOnlyAmino)
    throw new Error('Install keplr extension');

  try {
    // Enabling keplr is recommended. But is not what I like...
    await keplr.enable(chainId);
  } catch (e) {
    return;
  }

  const offlineSigner = getWindow()?.getOfflineSignerOnlyAmino!(chainId);
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
  return client.query.tendermint.getLatestBlock({}).then(block => {
    if (!block.block?.header?.chainId) return '';
    else return block.block?.header?.chainId;
  });
}

export function getHeight(): Promise<number> {
  if (!client) throw new Error('No client available');
  return client.query.tendermint.getLatestBlock({}).then(block => {
    if (!block.block?.header?.height) return 1;
    else return parseInt(block.block?.header?.height);
  });
}

export function instantiate(codeId: number, initMsg: object, label: string) {
  if (!signingClient) throw new Error('No signing client available');
  const sender = client?.address || '';
  const params: MsgInstantiateContractParams = {
    sender,
    codeId,
    initMsg,
    label,
  };
  const txOptions: TxOptions = {
    gasLimit: parseInt(config?.defaultFees?.init?.toString() || '150000'),
    broadcastMode: config?.broadcastMode || BroadcastMode.Sync,
  };
  return signingClient.tx.compute.instantiateContract(params, txOptions);
}

export function getContracts(
  codeId: number
): Promise<QueryContractsByCodeResponse> {
  if (!client) throw new Error('No client available');
  return client.query.compute.contractsByCode(codeId);
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
  const { balance }: QueryBalanceResponse = await client.query.bank.balance({
    address,
    denom: 'uscrt',
  });

  if (!balance) throw new Error('No account exists on chain');
  if (!balance?.amount) return '0';
  return balance?.amount;
}
