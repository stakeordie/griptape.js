import { getConfig } from '../bootstrap';
import BlockchainModule from './base';
import { Amount, ModuleBaseResponse } from './types';

/**
 * @member {AuthResult} result object with result of query
 */
export interface AuthAccountInfoResponse extends ModuleBaseResponse {
  result: AuthResult;
}

export interface AuthResult {
  type: string;
  value: AuthResultValue;
}
export interface AuthResultValue {
  address: string;
  coins: Amount[];
  public_key: string;
  account_number: number;
  sequence: number;
}

export class AuthModule extends BlockchainModule {
  /**
   * Get the account information on blockchain
   *
   * @returns AuthAccountInfoResponse object
   */
  async getAccountinfo(address: string): Promise<AuthAccountInfoResponse> {
    const res = await this.client.get(`/auth/accounts/${address}`);
    return res.data;
  }
}

// Add auth module.
let authModule: AuthModule;

export function useAuth() {
  const config = getConfig();
  if (!config) throw new Error('No client available');
  if (!authModule) {
    authModule = new AuthModule(config.restUrl);
  }
  return authModule;
}
