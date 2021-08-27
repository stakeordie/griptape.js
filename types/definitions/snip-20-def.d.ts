import { Context } from '../contracts';
export interface SNIP20Contract {
    getBalance: () => Record<string, unknown>;
    getTokenInfo: () => Record<string, unknown>;
    getTransferHistory: (page_size: number, page?: number) => Record<string, unknown>;
}
export declare const snip20Def: {
    queries: {
        getBalance({ address, key }: Context): Record<string, unknown>;
        getTokenInfo(): {
            token_info: {};
        };
        getTransferHistory({ address, key }: Context, page_size: number, page?: number | undefined): {
            transfer_history: {
                address: string | undefined;
                key: string | undefined;
                page_size: number;
                page: number | undefined;
            };
        };
        getExchangeRate(): {
            exchange_rate: {};
        };
    };
    messages: {
        transfer(recipient: string, amount: string, padding?: string | undefined): {
            transfer: {
                recipient: string;
                amount: string;
                padding: string | undefined;
            };
        };
        send(recipient: string, amount: string, msg?: string | undefined, padding?: string | undefined): {
            send: {
                recipient: string;
                amount: string;
                msg: string | undefined;
                padding: string | undefined;
            };
        };
        registerReceive(code_hash: string, padding?: string | undefined): {
            register_receive: {
                code_hash: string;
                padding: string | undefined;
            };
        };
        createViewingKey(entropy: string, padding?: string | undefined): {
            create_viewing_key: {
                entropy: string;
                padding: string | undefined;
            };
        };
        setViewingKey(key: string, padding?: string | undefined): {
            set_viewing_key: {
                key: string;
                padding: string | undefined;
            };
        };
        deposit(padding?: string | undefined): {
            deposit: {
                padding: string | undefined;
            };
        };
        redeem(amount: string, denom?: string | undefined, padding?: string | undefined): {
            redeem: {
                amount: string;
                denom: string | undefined;
                padding: string | undefined;
            };
        };
    };
};
