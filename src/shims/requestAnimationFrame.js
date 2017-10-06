/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
export default (() => {
    if (typeof requestAnimationFrame === 'function') {
        return requestAnimationFrame;
    }

    return callback => setTimeout(() => callback(Date.now()), 1000 / 60);
})();
