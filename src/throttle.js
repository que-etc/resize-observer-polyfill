import reqAnimFrame from './shims/requestAnimationFrame';

/**
 * Creates a wrapper function that ensures that provided callback will
 * be invoked only once during the specified delay period. It caches the last
 * call and re-invokes it after pending activation is resolved.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {Number} [delay = 0] - Delay after which to invoke callback.
 * @param {Boolean} [afterRAF = false] - Whether function needs to be invoked as
 *      a requestAnimationFrame callback.
 * @returns {Function}
 */
export default function (callback, delay = 0, afterRAF = false) {
    let leadCall = null,
        edgeCall = null;

    /**
     * Invokes the original callback function and schedules a new invocation if
     * the wrapper was called during current request.
     */
    function invokeCallback() {
        // Invoke original function.
        callback.apply(...leadCall);

        leadCall = null;

        // Schedule new invocation if there was a call during delay period.
        if (edgeCall) {
            proxy.apply(...edgeCall);

            edgeCall = null;
        }
    }

    /**
     * Callback that will be invoked after the specified delay period. It will
     * delegate invocation of the original function to the requestAnimationFrame
     * if "afterRAF" parameter is set to "true".
     */
    function timeoutCallback() {
        afterRAF ? reqAnimFrame(invokeCallback) : invokeCallback();
    }

    /**
     * Schedules invocation of the initial function.
     */
    function proxy(...args) {
        // eslint-disable-next-line no-invalid-this
        const callData = [this, args];

        // Cache current call to be re-invoked later if there is already a
        // pending call.
        if (leadCall) {
            edgeCall = callData;
        } else {
            leadCall = callData;

            // Schedule new invocation.
            setTimeout(timeoutCallback, delay);
        }
    }

    return proxy;
}
