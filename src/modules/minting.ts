import axios, { AxiosInstance } from 'axios';
import { getConfig } from '../bootstrap';

export class MintingModule {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

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
