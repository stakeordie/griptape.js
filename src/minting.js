import axios from 'axios';

import Inflation from './domain/inflation'

export async function getInflation() {
  const response = await axios.get('http://127.0.0.1:1317/minting/inflation');
  return new Inflation(response.data.height, response.data.result);
}
