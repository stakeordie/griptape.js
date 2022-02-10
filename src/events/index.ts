import { getWindow } from '../utils';
/**
 * Event API options.
 * Check https://developer.mozilla.org/en-US/docs/Web/API/Event.
 */

export * from './accounts';
export * from './viewing-keys';

export interface EventOptions {
  bubbles: boolean;
  cancelable: boolean;
}

/**
 * Callback is just a function that returns nothing.
 */
export type EventCallback = () => void;
export type CleanListenerCallback = () => void;

// Default event options, not sure if you need to override these.
const defaultEventOptions = { bubbles: true, cancelable: true };

export function emitEvent(
  name: string,
  options: EventOptions = defaultEventOptions
) {
  const event = new Event(name, options);
  document.dispatchEvent(event);
}

export function subscribeEvent(name: string, callback: EventCallback) {
  getWindow()?.addEventListener(name, callback);
}

export function unsubscribeEventCallback(
  name: string,
  callback: EventCallback
): CleanListenerCallback {
  return () => getWindow()?.removeEventListener(name, callback);
}
