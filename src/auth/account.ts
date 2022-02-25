import { Account } from './types';
import { getWindow } from '../utils';
import { getAddress } from '../bootstrap';

export class AccountManager {
  public readonly accounts: Array<Account> = [];

  constructor() {
    const item = getWindow()?.localStorage.getItem('griptape.js');
    if (item) {
      this.accounts = JSON.parse(item);
    }
  }

  public addAccount(): Account | undefined {
    const address = getAddress();
    if (!address) return;
    const account = { address, keys: [], permits: [] };
    this.accounts.push(account);
    return account;
  }

  public getAccount(): Account | undefined {
    const address = getAddress();
    return this.accounts.find(it => it.address === address);
  }
}
