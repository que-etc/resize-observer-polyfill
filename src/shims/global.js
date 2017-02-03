/**
 * Exports global object for the current environment.
 */
export default (function () {
    if (typeof global != 'undefined' && global.Math === Math) {
        return global;
    }

    if (typeof self != 'undefined' && self.Math === Math) {
        return self;
    }

    if (typeof window != 'undefined' && window.Math === Math) {
        return window;
    }

    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();
