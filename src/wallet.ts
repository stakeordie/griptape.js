import { Keplr, ChainInfo } from '@keplr-wallet/types'
import { assert } from './utils/assertions'

export class Wallet {

  keplr: Keplr

  chainId?: string

  constructor(keplr: Keplr) {
    this.keplr = keplr
  }

  async enable(): Promise<void> {
    if (!this.chainId) return

    this.keplr.enable(this.chainId)
  }

  async getAddress(): Promise<string> {
    if (!this.chainId) return ''

    const signer = window?.getOfflineSigner!(this.chainId)
    const [{ address }] = await signer.getAccounts()
    return address
  }

  async suggestToken(contractAddress: string): Promise<void> {
    assert(this.chainId, 'Chain id is not set')

    await this.keplr.suggestToken(this.chainId, contractAddress)
  }

  async getSnip20ViewingKey(contractAddress: string): Promise<string> {
    assert(this.chainId, 'Chain id is not set')

    return await this.keplr.getSecret20ViewingKey(this.chainId, contractAddress)
  }

  onKeplrChange(callback: Function) {
    window.addEventListener('keplr_keystorechange', async () => {
      await callback()
    })
  }
}

let wallet: Wallet | null = null

export function useWallet(): Promise<Wallet> {
  return new Promise<Wallet>((resolve, reject) => {
    if (wallet) {
      resolve(wallet)

      // We needed to return immediately
      return
    }

    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (!window.keplr) {
          reject()

          // Also here...
          return
        }

        if (wallet == null) {
          wallet = new Wallet(window.keplr)
        }

        resolve(wallet)

        document.removeEventListener('readystatechange', documentStateChange)
      }
    }

    document.addEventListener('readystatechange', documentStateChange)
  })
}
