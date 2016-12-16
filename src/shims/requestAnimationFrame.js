import global from './global';

/**
 * A shim for requestAnimationFrame which falls back
 * to setTimeout if the first one is not supported.
 *
 * @returns {Number} Requests' identifier.
 */
export default (() => {
    if (typeof global.requestAnimationFrame === 'function') {
        return global.requestAnimationFrame;
    }

    return callback => {
        return setTimeout(() => callback(Date.now()), 1000 / 60);
    };
})();
