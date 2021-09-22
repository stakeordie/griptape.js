import { getConfig } from '../bootstrap';
import BlockchainModule from './base';
import { BaseReq, Deposit, Fee } from './types';

//will be change for common type
export interface BankError {
  error: string;
}

//Will be change for common type
export interface BankBaseResponse {
  height: string;
}

/**
 * @member {Deposit []} result result of a query balance
 */
export interface BankBalanceResponse extends BankBaseResponse {
  result: Deposit[];
}

/**
 * @member {BaseReq} base_req is an object with base request information
 * @member {amount} amount array of Deposit object
 */
export interface BankTransferReq {
  base_req: BaseReq;
  amount: Deposit[];
}

/**
 * @member {string} type type of transaction
 * @member {BankTransferResponseValue} value object with transaction response
 */
export interface BankTransferResponse {
  type: string;
  value: BankTransferResponseValue;
}

export interface BankTransferResponseValue {
  msg: BankMsg[];
  fee: Fee;
  signatures: null;
  memo: string;
}

export interface BankMsg {
  type: string;
  value: BankMsgValue;
}

export interface BankMsgValue {
  from_address: string;
  to_address: string;
  amount: Deposit[];
}

export class BankModule extends BlockchainModule {
  /**
   * Get the account balances
   * @returns a BankBalanceResponse object or Error
   * */
  async getBalance(address: string): Promise<BankBalanceResponse | BankError> {
    const res = await this.client.get(`/bank/balances/${address}`);
    return res.data;
  }

  /**
   * Send coins from one account to another
   * @returns a BankTransferResponse object or may Error
   */
  async transfer(
    address: string,
    body_request: BankTransferReq
  ): Promise<BankTransferResponse | BankError> {
    const res = await this.client.post(
      `/bank/accounts/${address}/transfers`,
      body_request
    );
    return res.data;
  }
}

// Add Bank module.
let bankModule: BankModule;

export function useBank() {
  const config = getConfig();
  if (!config) throw new Error('No client available');
  if (!bankModule) {
    bankModule = new BankModule(config.restUrl);
  }
  return bankModule;
}
