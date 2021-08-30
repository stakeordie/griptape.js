export interface Key {
    id: string;
    contractAddress: string;
    value: string;
}
export interface Account {
    address: string;
    keys: Array<Key>;
}
export interface KeyForm {
    id: string;
    contractAddress: string;
    key: string;
}
export declare class ViewingKeyManager {
    private readonly accounts;
    constructor();
    add(contract: Record<string, string>, key: string): string;
    set(contract: Record<string, string>, key: string): void;
    get(idOrAddress: string): string | undefined;
    private createKey;
    private addAccount;
    private getAccount;
    private isEqual;
    private isKeyAdded;
}
