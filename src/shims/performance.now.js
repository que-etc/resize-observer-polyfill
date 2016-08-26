/**
 * A shim for performance.now method which falls back
 * to Date.now if the first one is not supported.
 *
 * @returns {Timestamp}
 */
export default (() => {
    if (
        window.performance &&
        typeof window.performance.now === 'function'
    ) {
        return () => window.performance.now();
    }

    return () => Date.now();
})();
