import {
  subscribeEvent,
  EventCallback,
  unsubscribeEventCallback,
  CleanListenerCallback,
} from './index';

/**
 * `account` event gets triggered when the Account Provider has an account ready.
 */
export function onAccountAvailable(
  callback: EventCallback
): CleanListenerCallback {
  subscribeEvent('account-available', callback);
  return unsubscribeEventCallback('account-available', callback);
}

/**
 * `account-change` events gets triggered when the account change on the Account
 * Provider.
 */
export function onAccountChange(
  callback: EventCallback
): CleanListenerCallback {
  subscribeEvent('account-change', callback);
  return unsubscribeEventCallback('account-change', callback);
}

export function onAccountNotAvailable(
  callback: EventCallback
): CleanListenerCallback {
  subscribeEvent('account-not-available', callback);
  return unsubscribeEventCallback('account-not-available', callback);
}

export function onAccountDisconnect(
  callback: EventCallback
): CleanListenerCallback {
  subscribeEvent('shutdown', callback);
  return unsubscribeEventCallback('shutdown', callback);
}
