import { Context, ContractRequest } from '../contracts';
export declare const snip20Def: {
    queries: {
        getBalance({ address, key }: Context): ContractRequest;
        getTokenInfo(): ContractRequest;
        getTransferHistory({ address, key }: Context, page_size: number, page?: number | undefined): ContractRequest;
        getExchangeRate(): ContractRequest;
    };
    messages: {
        transfer({ padding }: Context, recipient: string, amount: string): {
            handleMsg: {
                transfer: {
                    recipient: string;
                    amount: string;
                    padding: string | undefined;
                };
            };
        };
        send({ padding }: Context, recipient: string, amount: string, msg?: string | undefined): {
            handleMsg: {
                send: {
                    recipient: string;
                    amount: string;
                    msg: string | undefined;
                    padding: string | undefined;
                };
            };
        };
        registerReceive({ padding }: Context, code_hash: string): {
            handleMsg: {
                register_receive: {
                    code_hash: string;
                    padding: string | undefined;
                };
            };
        };
        createViewingKey({ padding }: Context, entropy: string): {
            handleMsg: {
                create_viewing_key: {
                    entropy: string;
                    padding: string | undefined;
                };
            };
        };
        setViewingKey({ padding }: Context, key: string): {
            handleMsg: {
                set_viewing_key: {
                    key: string;
                    padding: string | undefined;
                };
            };
        };
        deposit({ padding }: Context): {
            handleMsg: {
                deposit: {
                    padding: string | undefined;
                };
            };
        };
        redeem({ padding }: Context, amount: string, denom?: string | undefined): {
            handleMsg: {
                redeem: {
                    amount: string;
                    denom: string | undefined;
                    padding: string | undefined;
                };
            };
        };
    };
};
