import { subscribeEvent, EventCallback, CleanListenerCallback, unsubscribeEventCallback } from './index';

/**
 * This event gets emitted when a viewing key is created.
 */
export function onViewingKeyCreated(callback: EventCallback): CleanListenerCallback {
  subscribeEvent('viewing-key-created', callback);
  return unsubscribeEventCallback('viewing-key-created', callback);
}

export function onViewingKeyReady(callback: EventCallback): CleanListenerCallback {
  subscribeEvent('viewing-key-ready', callback);
  return unsubscribeEventCallback('viewing-key-ready', callback);
}
