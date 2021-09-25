import { getConfig } from '../bootstrap';
import BlockchainModule from './base';
import { ModuleBaseResponse, ModuleSimpleResponse } from './types';

/**
 * @member {string} height indicates the current block in the chain
 * @member { ParametersResult } result is an object with mintable parameters
 */
export interface MintParametersResponse extends ModuleBaseResponse {
  result: {
    mint_denom: string;
    inflation_rate_change: string;
    inflation_max: string;
    inflation_min: string;
    goal_bonded: string;
    blocks_per_year: string;
  };
}

export class MintingModule extends BlockchainModule {
  /**
   * @returns MintParametersResponse object with 'height' contains current block, 'result' contains all data
   */
  async getParameters(): Promise<MintParametersResponse> {
    const res = await this.client.get('/minting/parameters');
    return res.data;
  }

  /**
   * @returns ModuleSimpleResponse object with 'height' contains current block, 'result' contains inflation as string
   */
  async getInflation(): Promise<ModuleSimpleResponse> {
    const res = await this.client.get('/minting/inflation');
    return res.data;
  }

  /**
   * @returns ModuleSimpleResponse object with 'height' contains current block, 'result' contains anual provisions as string
   */
  async getAnualProvisions(): Promise<ModuleSimpleResponse> {
    const res = await this.client.get('/minting/annual-provisions');
    return res.data;
  }
}

// Add supply module.
let mintingModule: MintingModule;

export function useMinting() {
  const config = getConfig();
  if (!config) throw new Error('No client available');
  if (!mintingModule) {
    mintingModule = new MintingModule(config.restUrl);
  }
  return mintingModule;
}
