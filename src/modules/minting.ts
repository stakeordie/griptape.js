import { getConfig } from '../bootstrap';
import BlockchainModule from './base';

/**
 * @member {string} height indicates the current block in the chain
 */
export interface MintBaseResponse {
  /** indicates the current block in the chain */
  height: string;
}

/**
 * @member {string} height indicates the current block in the chain
 * @member { ParametersResult } result is an object with mintable parameters
 */
export interface MintParametersResponse extends MintBaseResponse {
  /**is an object with mintable parameters */
  result: MintParametersResult;
}

export interface MintParametersResult {
  mint_denom: string;
  inflation_rate_change: string;
  inflation_max: string;
  inflation_min: string;
  goal_bonded: string;
  blocks_per_year: string;
}

/**
 * @member {string} height indicates the current block in the chain
 * @member {string} result is a string representation of the result
 */
export interface MintRequestResponse extends MintBaseResponse {
  /** is a string representation of the result  */
  result: string;
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
   * @returns MintRequestResponse object with 'height' contains current block, 'result' contains inflation as string
   */
  async getInflation(): Promise<MintRequestResponse> {
    const res = await this.client.get('/minting/inflation');
    return res.data;
  }

  /**
   * @returns MintRequestResponse object with 'height' contains current block, 'result' contains anual provisions as string
   */
  async getAnualProvisions(): Promise<MintRequestResponse> {
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
