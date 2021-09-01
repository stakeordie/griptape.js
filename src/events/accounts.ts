import { subscribeEvent, Callback } from './index';
import { isAccountAvailable } from '../bootstrap';

/**
 * `account` event gets triggered when the Account Provider has an account ready.
 */
export function onAccountAvailable(callback: Callback) {
  if (isAccountAvailable()) {
    callback();
  } else {
    subscribeEvent('account-available', callback);
  }
}

/**
 * `account-change` events gets triggered when the account change on the Account
 * Provider.
 */
export function onAccountChange(callback: Callback) {
  subscribeEvent('account-change', callback);
}
