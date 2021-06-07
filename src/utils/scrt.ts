import { ExecuteResult } from 'secretjs';

const decoder = new TextDecoder(); // encoding defaults to utf-8

const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

export function generateEntropyString(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function handleContractResponse(response: ExecuteResult): object {
  try {
    return JSON.parse(decoder.decode(response.data));
  } catch (e) {
    throw e;
  }
}

export function bech32(str: string, abbrv: number): string {
  const half = (abbrv / 2) || 8;
  return str ? str.substring(0, half) + '...' + str.substring(str.length - half, str.length) : '';
}
