import { getConfig } from '../bootstrap';
import BlockchainModule from './base';

interface SupplyBaseResponse {
  /** Current block in the chain */
  height: string;
}

export interface SupplyResult {
  /** The name of the coin */
  denom: string;
  /** Total supply in string format */
  amount: string;
}

export interface TotalSupplyResponse extends SupplyBaseResponse {
  /** Array of totals supplies  */
  result: SupplyResult[];
}

export interface TotalSupplyDenomResponse extends SupplyBaseResponse {
  /** Amount of total supply for specific denom */
  result: string;
}

export interface SupplyError {
  /** RPC error managed for the server.*/
  error: string;
}

export class SupplyModule extends BlockchainModule {
  /**
   * Get total supply in native denom
   *
   * @returns TotalSupplyResponse object
   */
  async getTotal(): Promise<TotalSupplyResponse> {
    const res = await this.client.get('/supply/total');
    return res.data;
  }

  /**
   * Get total supply for an specific denom
   * @returns TotalSupplyDenomResponse or SupplyError
   * */
  async getTotalForDenom(
    denom: string
  ): Promise<TotalSupplyDenomResponse | SupplyError> {
    const res = await this.client.get(`/supply/total/${denom}`);
    return res.data;
  }
}

// Add supply module.
let supplyModule: SupplyModule;

export function useSupply() {
  const config = getConfig();
  if (!config) throw new Error('No client available');
  if (!supplyModule) {
    supplyModule = new SupplyModule(config.restUrl);
  }
  return supplyModule;
}
