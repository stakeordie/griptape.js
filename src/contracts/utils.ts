import { StdFee } from 'secretjs/types/types';

export function getValue(object: any, key: string): any {
  let value;
  Object.keys(object).some(k => {
    if (k === key) {
      value = object[k];
      return true;
    }
    if (object[k] && typeof object[k] === 'object') {
      value = getValue(object[k], key);
      return value !== undefined;
    }
  });
  return value;
}

export function hasOwnDeepProperty(obj: any, prop: string): boolean {
  if (typeof obj === 'object' && obj !== null) {
    if (obj.hasOwnProperty(prop)) {
      return true;
    }
    for (const p in obj) {
      if (obj.hasOwnProperty(p) && hasOwnDeepProperty(obj[p], prop)) {
        return true;
      }
    }
  }
  return false;
}

export function getEntropyString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function calculateCommonKeys(
  baseKeys: Array<string>,
  defKeys: Array<string>
): Array<string> {
  if (baseKeys.length === 0 || defKeys.length === 0) return [];

  const result: Array<string> = baseKeys.filter(key =>
    defKeys.find(k => k === key)
  );
  return result;
}

const gasPriceUscrt = 0.25;
export function getFeeForExecute(gas: number | undefined): StdFee | undefined {
  if (!gas) return undefined;
  return {
    amount: [
      {
        amount: String(Math.floor(gas * gasPriceUscrt) + 1),
        denom: 'uscrt',
      },
    ],
    gas: String(gas),
  };
}
