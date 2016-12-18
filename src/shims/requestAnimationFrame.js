/**
 * A shim for requestAnimationFrame which falls back
 * to setTimeout if the first one is not supported.
 *
 * @returns {Number} Requests' identifier.
 */
export default (() => {
    if (typeof requestAnimationFrame === 'function') {
        return requestAnimationFrame;
    }

    return callback => {
        return setTimeout(() => callback(Date.now()), 1000 / 60);
    };
})();
