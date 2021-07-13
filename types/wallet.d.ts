import { Keplr } from '@keplr-wallet/types';
export declare const getExperimentalConfig: (props: {
    chainId: string;
    chainName: string;
    rpc: string;
    rest: string;
}) => {
    chainId: string;
    chainName: string;
    rpc: string;
    rest: string;
    bip44: {
        coinType: number;
    };
    coinType: number;
    stakeCurrency: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
    };
    bech32Config: {
        bech32PrefixAccAddr: string;
        bech32PrefixAccPub: string;
        bech32PrefixValAddr: string;
        bech32PrefixValPub: string;
        bech32PrefixConsAddr: string;
        bech32PrefixConsPub: string;
    };
    currencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
    }[];
    feeCurrencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
    }[];
    gasPriceStep: {
        low: number;
        average: number;
        high: number;
    };
    features: string[];
};
export declare class Wallet {
    keplr: Keplr;
    chainId?: string;
    constructor(keplr: Keplr);
    enable(): Promise<void>;
    getAddress(): Promise<string>;
    suggestToken(contractAddress: string): Promise<void>;
    getSnip20ViewingKey(contractAddress: string): Promise<string>;
    onKeplrChange(callback: Function): void;
}
export declare function useWallet(): Promise<Wallet>;
