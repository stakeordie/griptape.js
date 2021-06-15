import { Keplr } from '@keplr-wallet/types';
export declare function getWallet(): Promise<Wallet>;
export declare class Wallet {
    keplr: Keplr;
    chainId?: string;
    constructor(keplr: Keplr);
    enable(): Promise<void>;
    getAddress(): Promise<string>;
    onKeplrChange(callback: Function): void;
}
export declare function useWallet(): Promise<Wallet>;
