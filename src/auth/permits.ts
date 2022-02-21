import { getAddress, getChainId } from '../bootstrap';
import { BaseContract } from '../contracts/types';
import { getKeplr } from '../wallet';

export class PermitManager {
  public get(contract: BaseContract): boolean {
    return hasPermit(contract);
  }

  public async add(
    contract: BaseContract,
    permissions: string[] = []
  ): Promise<void> {
    return await enablePermit(contract, permissions);
  }
}

/**
 * @deprecated
 * @param contract is an object that represents a contract client (returned by createContractClient)
 * @returns boolean
 */
export function hasPermit(contract: BaseContract): boolean {
  const address = getAddress();
  if (!address) throw new Error('No address available');
  return localStorage.getItem(`query_permit_${address + contract.at}`) != null;
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
  const address = getAddress();
  if (!address) throw new Error('No address available');
  let permit = JSON.parse(
    localStorage.getItem(`query_permit_${address + contract.at}`) as string
  );

  if (!permit) {
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

    permit = {
      params: {
        permit_name: permitName,
        allowed_tokens: allowedTokens,
        chain_id: chainId,
        permissions: permissions,
      },
      signature: signature,
    };

    localStorage.setItem(
      `query_permit_${address + contract.at}`,
      JSON.stringify(permit) as string
    );
  }
}
