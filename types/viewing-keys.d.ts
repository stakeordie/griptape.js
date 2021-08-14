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
    address: string | undefined;
    constructor();
    add(form: KeyForm): string;
    createKey(form: KeyForm): Key;
    get(idOrAddress: string): string | undefined;
    private addAccount;
    private getAccount;
    private isEqual;
    private isKeyAdded;
}
