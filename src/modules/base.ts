import axios, { AxiosInstance } from 'axios';

export default class BlockchainModule {
  client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }
}
