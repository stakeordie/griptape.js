import { ExecuteResult } from 'secretjs';
export declare function generateEntropyString(length: number): string;
export declare function handleContractResponse(response: ExecuteResult): object;
export declare function bech32(str: string, abbrv: number): string;
