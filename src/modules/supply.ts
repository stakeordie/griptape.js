import axios, { AxiosInstance } from 'axios';
import { getConfig } from '../bootstrap';
import BlockchainModule from './base';

export class SupplyModule extends BlockchainModule {
  async getTotal(): Promise<object> {
    const res = await this.client.get('/supply/total');
    return res.data;
  }

  async getTotalForDenom(denom: string): Promise<object> {
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
