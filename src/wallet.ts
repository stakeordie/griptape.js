import { Keplr } from '@keplr-wallet/types';
import { getWindow } from './utils';

export async function getKeplr(): Promise<Keplr | undefined> {
  if (getWindow()?.keplr) {
    return getWindow()?.keplr;
  }

  if (getWindow()?.document.readyState === 'complete') {
    return getWindow()?.keplr;
  }

  return new Promise(resolve => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        resolve(getWindow()?.keplr);
        getWindow()?.document.removeEventListener(
          'readystatechange',
          documentStateChange
        );
      }
    };

    getWindow()?.document.addEventListener(
      'readystatechange',
      documentStateChange
    );
  });
}
