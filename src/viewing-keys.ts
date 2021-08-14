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
  private readonly accounts: Array<Account> = []

  address: string | undefined

  constructor() {
    const item = localStorage.getItem('griptape.js');
    if (item) {
      this.accounts = JSON.parse(item);
    }
  }

  public add(form: KeyForm): string {
    if (!this.address) throw new Error('Address not available');

    let account = this.getAccount();
    if (!account) {
      account = this.addAccount();
    }
    const key = account.keys.find(it => this.isKeyAdded(it, form));
    if (key) return key.value;
    const newKey = this.createKey(form);
    account.keys.push(newKey);
    localStorage.setItem('griptape.js', JSON.stringify(this.accounts));
    return newKey.value;
  }

  public createKey(form: KeyForm): Key {
    if (!this.address) throw new Error('Address not available');
    const { id, contractAddress, key: value } = form;
    return {
      id,
      contractAddress,
      value
    } as Key;
  }

  public get(idOrAddress: string): string | undefined {
    const account = this.getAccount();
    if (!account) return;
    const key = account.keys.find(it => this.isEqual(it, idOrAddress));
    if (!key) return;
    return key.value;
  }

  private addAccount(): Account {
    if (!this.address) throw new Error('Address not available');

    const { address } = this;
    const account = { address, keys: [] };
    this.accounts.push(account);
    return account;
  }

  private getAccount(): Account | undefined {
    if (!this.address) return;
    return this.accounts.find(it => it.address === this.address);
  }

  private isEqual(a: Key, idOrAddress: string): boolean {
    return a.contractAddress === idOrAddress
        || a.id === idOrAddress
  }

  private isKeyAdded(a: Key, b: KeyForm): boolean {
    if (!this.address) throw new Error('Address not available');
    return a.contractAddress === b.contractAddress || a.id === b.id;
  }
}
