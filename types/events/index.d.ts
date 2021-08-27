/**
 * Event API options.
 * Check https://developer.mozilla.org/en-US/docs/Web/API/Event.
 */
export interface EventOptions {
    bubbles: boolean;
    cancelable: boolean;
}
/**
 * Callback is just a function that returns nothing.
 */
export declare type Callback = () => void;
export declare function emitEvent(name: string, options?: EventOptions): void;
export declare function subscribeEvent(name: string, callback: Callback): void;
