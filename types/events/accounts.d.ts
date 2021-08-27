import { Callback } from './index';
/**
 * `account` event gets triggered when the Account Provider has an account ready.
 */
export declare function onAccountAvailable(callback: Callback): void;
/**
 * `account-change` events gets triggered when the account change on the Account
 * Provider.
 */
export declare function onAccountChange(callback: Callback): void;
