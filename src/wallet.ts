import { Keplr } from '@keplr-wallet/types';
import { getWindow } from './utils';

export async function getKeplr(): Promise<Keplr | undefined> {
  if (getWindow()?.keplr) {
    return getWindow()?.keplr;
  }

  if (document.readyState === 'complete') {
    return getWindow()?.keplr;
  }

  return new Promise(resolve => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        resolve(getWindow()?.keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
}
