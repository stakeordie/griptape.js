import { getKeplr } from './wallet';
import { SecretUtils, OfflineAminoSigner } from '@keplr-wallet/types';
// import { Coin, StdFee } from 'secretjs/types/types.js';
import {
  // CosmWasmClient,
  SecretNetworkClient,
  // ExecuteResult,
  // FeeTable,
  BroadcastMode,
  MsgExecuteContract,
  TxResponse,
  Coin,
  TxOptions,
} from 'secretjs';
import {
  KeplrViewingKeyManager,
  ViewingKeyManager,
  PermitManager,
} from './auth/index';
import { emitEvent } from './events';
import { getWindow } from './utils';
import { StdFee } from 'secretjs/dist/wallet_amino';
import { ContractInfoWithAddress } from 'secretjs/dist/grpc_gateway/secret/compute/v1beta1/query.pb';

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
  getSigner: () => OfflineAminoSigner;
  getSeed: () => SecretUtils;
  getName: () => string;
}
interface WalletInfo {
  address: string | undefined;
  name: string | undefined;
}

export type AccountProviderGetter = (
  chainId: string
) => Promise<AccountProvider | undefined>;

let config: Config | undefined;
let signingClient: SecretNetworkClient | undefined;
let broadcastMode: BroadcastMode | undefined;
let client: SecretNetworkClient | undefined;
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

export function getWalletInfo(): WalletInfo {
  const address = provider?.getAddress();
  const name = provider?.getName();
  return {
    address: address,
    name: name,
  };
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

    let connected;

    if (typeof localStorage !== 'undefined') {
      connected = localStorage.getItem('connected');

      if (connected == null) {
        emitEvent('account-not-available');
        return;
      }
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
  if (!config?.chainId) throw new Error('No configuration was set');
  client = new SecretNetworkClient({
    url: config.restUrl,
    chainId: config.chainId,
  });
}

async function initSigningClient(): Promise<void> {
  if (!config?.chainId) throw new Error('No configuration was set');
  if (!client) throw new Error('No client available');
  if (!provider) throw new Error('No provider available');

  const { restUrl } = config;

  if (!provider) return;

  const address = provider.getAddress();
  const signer = provider.getSigner();
  const seed = provider.getSeed();
  broadcastMode = config.broadcastMode;

  signingClient = new SecretNetworkClient({
    url: restUrl,
    chainId: config.chainId,
    walletAddress: address,
    wallet: signer,
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
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('connected', 'connected');
  }
}

// Copy of bootstrap without triggering the onAccountAvailable event
async function reloadSigningClient(): Promise<void> {
  const chainId = await getChainId();

  provider = await getKeplrAccountProviderInternal(chainId, false);
  accountAvailable = true;
  await initSigningClient();
}

export function shutdown() {
  let connected;
  if (typeof localStorage !== 'undefined') {
    connected = localStorage.getItem('connected');
  }

  if (!connected) return;
  accountAvailable = false;
  emitEvent('shutdown');
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('connected');
  }
}

// TODO Move this to `contracts.ts`
export function queryContract(
  address: string,
  queryMsg: Record<string, unknown>,
  addedParams?: undefined,
  codeHash?: string
): Promise<Record<string, unknown>> {
  if (!client) throw new Error('No client available');
  return client.query.compute.queryContract({
    contract_address: address,
    query: queryMsg,
    code_hash: codeHash,
  });
}

// TODO Move this to `contracts.ts`
export async function executeContract(
  contractAddress: string,
  handleMsg: Record<string, unknown>,
  memo?: string,
  transferAmount?: Coin[],
  fee?: StdFee,
  codeHash?: string
): Promise<TxResponse> {
  if (!signingClient) throw new Error('No signing client available');
  if (!provider) throw new Error('No provider available');

  const gasLimitStr = fee?.amount?.[0]?.amount;
  const gasLimit = gasLimitStr ? Number(gasLimitStr) : undefined;
  const opts: TxOptions | undefined =
    fee || memo || broadcastMode
      ? { memo, feeGranter: fee?.granter, gasLimit, broadcastMode }
      : undefined;

  return signingClient.tx.broadcast(
    [
      new MsgExecuteContract({
        sender: provider.getAddress(),
        contract_address: contractAddress,
        msg: handleMsg,
        sent_funds: transferAmount,
        code_hash: codeHash,
      }),
    ],
    opts
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
  const key = await keplr.getKey(chainId);
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
    getName: () => key.name,
  };
}

export function getKeplrAccountProvider(): AccountProviderGetter {
  return async (chainId: string) => {
    return await getKeplrAccountProviderInternal(chainId);
  };
}

export async function getChainId(): Promise<string> {
  if (!client) throw new Error('No client available');
  // @ts-ignore `chainId` is private
  return client.chainId;
}

export async function getHeight(): Promise<number> {
  if (!client) throw new Error('No client available');
  const block = await client.query.tendermint.getLatestBlock({});
  const height = block.block?.last_commit?.height;
  if (!height) {
    throw new Error('Could not fetch block info');
  }
  return Number(height);
}

export function instantiate(
  codeId: number,
  initMsg: object,
  label: string,
  codeHash?: string
) {
  if (!signingClient) throw new Error('No signing client available');
  return signingClient.tx.compute.instantiateContract(
    {
      sender: signingClient.address,
      code_id: codeId,
      code_hash: codeHash, // optional but way faster
      init_msg: initMsg,
      label,
    },
    { broadcastMode }
  );
}

export async function getContracts(
  codeId: number
): Promise<ContractInfoWithAddress[]> {
  if (!client) throw new Error('No client available');
  const { contract_infos } = await client.query.compute.contractsByCodeId({
    code_id: codeId.toString(),
  });

  if (!contract_infos) {
    throw new Error('request failed');
  }

  return contract_infos;
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
  const res = await client.query.bank.balance({ address, denom: 'uscrt' });
  if (!res) throw new Error('No account exists on chain');
  const balance = res.balance;
  if (!balance?.amount) throw new Error('No balance available');
  return balance.amount;
}
