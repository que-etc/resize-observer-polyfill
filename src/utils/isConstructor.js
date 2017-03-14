import global from '../shims/global';

/**
 * Tells whether provided global property exists and it's a constructor function.
 *
 * @param {string} target - Key of the property.
 * @returns {boolean}
 */
export default target => {
    const value = global[target];

    // In some browsers "typeof" may return "object" for constructors
    // (MutationObserver in Safari) or interfaces (SVGElement in Internet Explorer).
    if (typeof value == 'function' || typeof value == 'object') {
        return value.prototype && value.prototype.constructor === value;
    }

    return false;
};
