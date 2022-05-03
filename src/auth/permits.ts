import { getWindow } from '../utils';
import { getAddress, getChainId } from '../bootstrap';
import { BaseContract } from '../contracts/types';
import { getKeplr } from '../wallet';
import { PermitForm } from './types';
import { AccountManager } from './account';

export class PermitManager extends AccountManager {
  constructor() {
    super();
  }

  public get(contract: BaseContract): boolean {
    let account = this.getAccount();
    if (!account) {
      account = this.addAccount();
    }
    const permit = account?.permits.find(
      permit => permit.contractAddress == contract.at
    );
    return permit ? true : false;
  }

  public async add(
    contract: BaseContract,
    permissions: string[] = []
  ): Promise<void> {
    if (permissions.length == 0)
      throw new Error('Must indicate permissions when creating a permit');

    let account = this.getAccount();
    if (!account) {
      account = this.addAccount();
    }
    let isPermit = hasPermit(contract);
    const address = getAddress();
    if (!address) throw new Error('No address available');

    if (!isPermit) {
      const permitName = contract.at;
      const allowedTokens = [contract.at];
      const chainId = await getChainId();
      const keplr = await getKeplr();

      if (!keplr) throw new Error('No keplr is available');

      const { signature } = await keplr.signAmino(
        chainId,
        address,
        {
          chain_id: chainId,
          account_number: '0', // Must be 0
          sequence: '0', // Must be 0
          fee: {
            amount: [{ denom: 'uscrt', amount: '0' }], // Must be 0 uscrt
            gas: '1', // Must be 1
          },
          msgs: [
            {
              type: 'query_permit', // Must be "query_permit"
              value: {
                permit_name: permitName,
                allowed_tokens: allowedTokens,
                permissions: permissions,
              },
            },
          ],
          memo: '', // Must be empty
        },
        {
          preferNoSetFee: true, // Fee must be 0, so hide it from the user
          preferNoSetMemo: true, // Memo must be empty, so hide it from the user
        }
      );

      let permit = {
        params: {
          permit_name: permitName,
          allowed_tokens: allowedTokens,
          chain_id: chainId,
          permissions: permissions,
        },
        signature: signature,
      };

      const form: PermitForm = {
        id: contract.id || contract.at,
        contractAddress: contract.at,
        permit: permit,
      };

      account?.permits.push(form);

      getWindow()?.localStorage.setItem(
        'griptape.js',
        JSON.stringify(this.accounts)
      );
    }
  }
}

/**
 * @deprecated
 * @param contract is an object that represents a contract client (returned by createContractClient)
 * @returns boolean
 */
export function hasPermit(contract: BaseContract): boolean {
  const accountManager = new AccountManager();
  let account = accountManager.getAccount();
  if (!account) {
    account = accountManager.addAccount();
  }
  const permit = account?.permits.find(
    permit => permit.contractAddress == contract.at
  );
  return permit ? true : false;
}

/**
 * @deprecated
 * @param contract is an object that represents a contract client (returned by createContractClient)
 * @param permissions
 */
export async function enablePermit(
  contract: BaseContract,
  permissions: string[] = []
): Promise<void> {
  const accountManager = new AccountManager();
  let account = accountManager.getAccount();
  if (!account) {
    account = accountManager.addAccount();
  }
  let isPermit = hasPermit(contract);
  const address = getAddress();
  if (!address) throw new Error('No address available');
  // let permit = JSON.parse(
  //   localStorage.getItem(`query_permit_${address + contract.at}`) as string
  // );

  if (!isPermit) {
    const permitName = contract.at;
    const allowedTokens = [contract.at];
    const chainId = await getChainId();
    const keplr = await getKeplr();

    if (!keplr) throw new Error('No keplr is available');

    const { signature } = await keplr.signAmino(
      chainId,
      address,
      {
        chain_id: chainId,
        account_number: '0', // Must be 0
        sequence: '0', // Must be 0
        fee: {
          amount: [{ denom: 'uscrt', amount: '0' }], // Must be 0 uscrt
          gas: '1', // Must be 1
        },
        msgs: [
          {
            type: 'query_permit', // Must be "query_permit"
            value: {
              permit_name: permitName,
              allowed_tokens: allowedTokens,
              permissions: permissions,
            },
          },
        ],
        memo: '', // Must be empty
      },
      {
        preferNoSetFee: true, // Fee must be 0, so hide it from the user
        preferNoSetMemo: true, // Memo must be empty, so hide it from the user
      }
    );

    let permit = {
      params: {
        permit_name: permitName,
        allowed_tokens: allowedTokens,
        chain_id: chainId,
        permissions: permissions,
      },
      signature: signature,
    };

    const form: PermitForm = {
      id: contract.id || contract.at,
      contractAddress: contract.at,
      permit: permit,
    };

    account?.permits.push(form);

    getWindow()?.localStorage.setItem(
      'griptape.js',
      JSON.stringify(accountManager.accounts)
    );
  }
}
