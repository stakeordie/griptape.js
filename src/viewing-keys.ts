import { emitEvent } from './events';
import { getAddress, getChainId } from './bootstrap';
import { BaseContract } from './contracts/types';
import { getKeplr } from './wallet';

export interface Key {
  id: string;
  contractAddress: string;
  value: string;
}

export interface Account {
  address: string;
  keys: Array<Key>;
}

export interface KeyForm {
  id: string;
  contractAddress: string;
  key: string;
}

export class ViewingKeyManager {
  private readonly accounts: Array<Account> = [];

  constructor() {
    const item = localStorage.getItem('griptape.js');
    if (item) {
      this.accounts = JSON.parse(item);
    }
  }

  public add(contract: BaseContract, key: string): string {
    if (!key) throw new Error('Empty or undefined key cannot be added');
    // TODO We might want to remove the use of a form.
    const form: KeyForm = {
      id: contract.id,
      contractAddress: contract.at,
      key: key,
    };

    let account = this.getAccount();
    if (!account) {
      account = this.addAccount();
    }
    if (!account) throw new Error('No account available');

    const theKey = account?.keys.find(it => this.isKeyAdded(it, form));
    if (theKey) return theKey.value;

    const newKey = this.createKey(form);
    account.keys.push(newKey);
    localStorage.setItem('griptape.js', JSON.stringify(this.accounts));
    emitEvent('viewing-key-created');
    return newKey.value;
  }

  public set(contract: BaseContract, key: string): void {
    const form: KeyForm = {
      id: contract.id,
      contractAddress: contract.at,
      key: key,
    };
    let account = this.getAccount();
    if (!account) {
      account = this.addAccount();
    }
    const theKey = account?.keys.find(it => this.isKeyAdded(it, form));
    if (!theKey) return;

    // Update the viewing key.
    theKey.value = key;

    // Update local storage.
    localStorage.setItem('griptape.js', JSON.stringify(this.accounts));
  }

  public get(idOrAddress: string): string | undefined {
    let account = this.getAccount();
    if (!account) {
      account = this.addAccount();
    }
    const key = account?.keys.find(it => this.isEqual(it, idOrAddress));
    if (!key) return;
    return key.value;
  }

  private createKey(form: KeyForm): Key {
    const { id, contractAddress, key: value } = form;
    return {
      id,
      contractAddress,
      value,
    } as Key;
  }

  private addAccount(): Account | undefined {
    const address = getAddress();
    if (!address) return;
    const account = { address, keys: [] };
    this.accounts.push(account);
    return account;
  }

  private getAccount(): Account | undefined {
    const address = getAddress();
    return this.accounts.find(it => it.address === address);
  }

  private isEqual(a: Key, idOrAddress: string): boolean {
    return a.contractAddress === idOrAddress || a.id === idOrAddress;
  }

  private isKeyAdded(a: Key, b: KeyForm): boolean {
    return a.contractAddress === b.contractAddress || a.id === b.id;
  }
}

/**
 * Keplr-compliant viewing key manager. This class enables to add and get
 * viewing keys from Keplr in order to use it with other Griptape.js API's.
 */
export class KeplrViewingKeyManager {
  private readonly viewingKeyManager: ViewingKeyManager;

  /**
   * Creates a new {@link KeplrViewingKeyManager}
   * @param viewingKeyManager A viewing key manager instance.
   */
  constructor(viewingKeyManager: ViewingKeyManager) {
    this.viewingKeyManager = viewingKeyManager;
  }

  /**
   * Adds a new viewing key by using the `suggestToken` API from Keplr.
   * @param contract A contract to create a viewing key for.
   * @returns a viewing key.
   */
  public async add(contract: BaseContract): Promise<string> {
    const keplr = await getKeplr();
    if (!keplr) throw new Error('Keplr is not installed');
    const chainId = await getChainId();
    await keplr.suggestToken(chainId, contract.at);
    const key = await keplr.getSecret20ViewingKey(chainId, contract.at);
    this.viewingKeyManager.add(contract, key);
    return key;
  }

  /**
   * Get a viewing key. This does not call Keplr in order to get it.
   * @param idOrAddress Id or address of the contract.
   * @returns a viewing key.
   */
  public get(idOrAddress: string): string | undefined {
    return this.viewingKeyManager.get(idOrAddress);
  }
}
