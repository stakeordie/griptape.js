import { emitEvent } from '../events';
import { getChainId } from '../bootstrap';
import { BaseContract } from '../contracts/types';
import { getKeplr } from '../wallet';
import { getWindow } from '../utils';
import { KeyForm, Key, Account } from './types';
import { AccountManager } from './account';

const localKey = 'griptape.js';

export class ViewingKeyManager extends AccountManager {
  constructor() {
    super();
  }

  public add(contract: BaseContract, key: string): string {
    if (!key) throw new Error('Empty or undefined key cannot be added');
    // TODO We might want to remove the use of a form.
    const form: KeyForm = {
      id: contract.id || contract.at,
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
    getWindow()?.localStorage.setItem(localKey, JSON.stringify(this.accounts));
    emitEvent('viewing-key-created');
    return newKey.value;
  }

  public set(contract: BaseContract, key: string): void {
    const form: KeyForm = {
      id: contract.id || contract.at,
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
    getWindow()?.localStorage.setItem(localKey, JSON.stringify(this.accounts));
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

  public remove(idOrAddress: string): void {
    const key = this.get(idOrAddress);
    if (!key) {
      throw new Error(`No id or contract found with ${idOrAddress}`);
    }

    const storageData = getWindow()?.localStorage.getItem(localKey);
    if (!storageData) {
      throw new Error(`No id or contract found with ${idOrAddress}`);
    }

    const account = this.getAccount();
    const localData = JSON.parse(storageData as string) as Account[];
    const index = account?.keys.findIndex(({ value }) => value === key);
    const localIndex = localData[0].keys.findIndex(
      ({ value }) => value === key
    );

    if (index === undefined || localIndex === undefined) {
      throw new Error(`No id or contract found with ${idOrAddress}`);
    }
    //remove vk from account data
    account?.keys.splice(index as number, 1);
    //remove vk from local storage
    localData[0].keys.splice(localIndex as number, 1);
    getWindow()?.localStorage.setItem(localKey, JSON.stringify(localData));
  }

  private createKey(form: KeyForm): Key {
    const { id, contractAddress, key: value } = form;
    return {
      id,
      contractAddress,
      value,
    } as Key;
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
