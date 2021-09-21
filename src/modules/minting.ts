import axios, { AxiosInstance } from 'axios';
import { getConfig } from '../bootstrap';
import BlockchainModule from './base';

export class MintingModule extends BlockchainModule {
  async getParameters(): Promise<object> {
    const res = await this.client.get('/minting/parameters');
    return res.data;
  }

  async getInflation(): Promise<object> {
    const res = await this.client.get('/minting/inflation');
    return res.data;
  }

  async getAnualProvisions(): Promise<object> {
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
