import { getConfig } from '../bootstrap';
import BlockchainModule from './base';
import {
  Amount,
  ModuleBaseResponse,
  ModuleErrorResponse,
  ModuleSimpleResponse,
} from './types';

export interface TotalSupplyResponse extends ModuleBaseResponse {
  /** Array of totals supplies  */
  result: Amount[];
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
   * @returns ModuleSimpleResponse or ModuleErrorResponse
   * */
  async getTotalForDenom(
    denom: string
  ): Promise<ModuleSimpleResponse | ModuleErrorResponse> {
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
