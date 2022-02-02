import { subscribeEvent, Callback, unsubscribeEventCallback } from './index';

/**
 * `account` event gets triggered when the Account Provider has an account ready.
 */
export function onAccountAvailable(callback: Callback): Callback {
  subscribeEvent('account-available', callback);
  return unsubscribeEventCallback('account-available', callback);
}

/**
 * `account-change` events gets triggered when the account change on the Account
 * Provider.
 */
export function onAccountChange(callback: Callback): Callback {
  subscribeEvent('account-change', callback);
  return unsubscribeEventCallback('account-change', callback);
}

export function onAccountNotAvailable(callback: Callback): Callback {
  subscribeEvent('account-not-available', callback);
  return unsubscribeEventCallback('account-not-available', callback);
}

export function onAccountDisconnect(callback: Callback): Callback {
  subscribeEvent('shutdown', callback);
  return unsubscribeEventCallback('shutdown', callback);
}
