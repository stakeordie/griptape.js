import {
  SigningCosmWasmClient,
  CosmWasmClient,
  FeeTable,
  Account,
  ExecuteResult
} from 'secretjs'
import {
  Coin,
  StdFee
} from 'secretjs/types/types.js'
import { assert } from './utils/assertions'
import { Wallet } from './wallet'

const decoder = new TextDecoder() // encoding defaults to utf-8
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const charactersLength = characters.length

export function generateEntropyString(length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function bech32(str: string, abbrv: number): string {
  if (!str) return ''
  const half = (abbrv / 2) || 8
  return str.substring(0, half) + '...'
       + str.substring(str.length - half, str.length)
}

function handleContractResponse(response: ExecuteResult): object {
  try {
    return JSON.parse(decoder.decode(response.data))
  } catch (e) {
    throw e
  }
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
}

export class ScrtClient {

  readonly cosmWasmClient: CosmWasmClient

  readonly signingCosmWasmClient: SigningCosmWasmClient

  constructor(cosmWasmClient: CosmWasmClient,
              signingCosmWasmClient: SigningCosmWasmClient) {
    this.cosmWasmClient = cosmWasmClient
    this.signingCosmWasmClient = signingCosmWasmClient
  }

  async queryContract(address: string, queryMsg: object): Promise<object> {
    return await this.cosmWasmClient.queryContractSmart(address, queryMsg)
  }

  async executeContract(
    contractAddress: string,
    handleMsg: object,
    memo?: string,
    transferAmount?: readonly Coin[],
    fee?: StdFee
  ): Promise<object> {
    try {
      const response = await this.signingCosmWasmClient.execute(
        contractAddress, handleMsg, memo, transferAmount, fee)
      return handleContractResponse(response)
    } catch(e: any) {
      // TODO improve error handling here
      throw e
    }
  }

  async getAccount(address: string): Promise<Account | undefined> {
    return await this.signingCosmWasmClient.getAccount(address)
  }
}

export function createScrtClient(restUrl: string, wallet: Wallet):
  Promise<ScrtClient | undefined> {

  return new Promise<ScrtClient | undefined>(async (resolve, reject) => {
    const cosmWasmClient = new CosmWasmClient(restUrl)
    const { keplr } = wallet

    let chainId
    try {
      chainId = await cosmWasmClient.getChainId()
    } catch(e) {
      resolve(undefined)
      return
    }

    if (chainId) {
      try {
        // Enabling the wallet ASAP is recommended.
        await keplr.enable(chainId)
      } catch(e) {
        resolve(undefined)
        return
      }
    }

    // Set the chain id in the wallet.
    wallet.chainId = chainId

    const address = await wallet.getAddress()
    const signer = await window?.getOfflineSigner!(chainId)
    const enigmaUtils = await wallet.keplr.getEnigmaUtils(chainId)

    const signingCosmWasmClient = new SigningCosmWasmClient(
      // @ts-ignore
      restUrl, address, signer, enigmaUtils, customFees)
    const scrtClient = new ScrtClient(cosmWasmClient, signingCosmWasmClient)
    resolve(scrtClient)
  })
}
