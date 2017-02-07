import requestAnimationFrame from '../shims/requestAnimationFrame';

// Defines minimum timeout before adding a trailing call.
const trailingTimeout = 2;

/**
 * Returns time stamp retrieved either from the "performance.now" or from
 * the "Date.now" method.
 *
 * @returns {DOMHighResTimeStamp|number}
 */
const timeStamp = (() => {
    let host = Date;

    if (typeof performance === 'object' && typeof performance.now === 'function') {
        host = performance;
    }

    return () => host.now();
})();

/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period. It also caches the last
 * call and re-invokes it after pending activation is resolved.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @param {boolean} [afterRAF = false] - Whether function needs to be invoked as
 *      a requestAnimationFrame callback.
 * @returns {Function}
 */
export default function (callback, delay, afterRAF = false) {
    let leadingCall = false,
        trailingCall = false,
        lastCallTime = 0;

    /**
     * Invokes the original callback function and schedules a new invocation if
     * the wrapper was called during current request.
     *
     * @returns {void}
     */
    function invokeCallback() {
        leadingCall = false;

        // Invoke original function.
        callback();

        // Schedule new invocation if there has been a call during delay period.
        if (trailingCall) {
            proxy();
        }
    }

    /**
     * Callback that will be invoked after the specified delay period. It will
     * delegate invocation of the original function to the requestAnimationFrame
     * if "afterRAF" parameter is set to "true".
     *
     * @returns {void}
     */
    function timeoutCallback() {
        afterRAF ? requestAnimationFrame(invokeCallback) : invokeCallback();
    }

    /**
     * Schedules invocation of the initial function.
     *
     * @returns {void}
     */
    function proxy() {
        const callTime = timeStamp();

        // Postpone activation if there is already a pending call.
        if (leadingCall) {
            // Reject immediately following invocations.
            if (callTime - lastCallTime < trailingTimeout) {
                return;
            }

            trailingCall = true;
        } else {
            leadingCall = true;
            trailingCall = false;

            // Schedule new invocation.
            setTimeout(timeoutCallback, delay);
        }

        lastCallTime = callTime;
    }

    return proxy;
}
