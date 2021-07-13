import { Griptape, GriptapeConfig } from './types';
import { useWallet } from './wallet';
import { createScrtClient } from './wsecretjs';

export function grip(conf: GriptapeConfig): Promise<Griptape> {
  // TODO assert config properties
  return new Promise<Griptape>(async (resolve, reject) => {
    try {
      const wallet = await useWallet();
      const scrtClient = await createScrtClient(conf, wallet);
      resolve({ wallet, scrtClient } as Griptape);
    } catch (e) {
      reject(e);
    }
  });
}
