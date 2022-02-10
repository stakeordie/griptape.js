import { subscribeEvent, EventCallback } from './index';

/**
 * This event gets emitted when a viewing key is created.
 */
export function onViewingKeyCreated(callback: EventCallback) {
  subscribeEvent('viewing-key-created', callback);
}

export function onViewingKeyReady(callback: EventCallback) {
  subscribeEvent('viewing-key-ready', callback);
}
