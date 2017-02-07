/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
import global from './global';

/* eslint-disable require-jsdoc */
export const Map = (() => {
    if (typeof global.Map === 'function') {
        return global.Map;
    }

    function getIndex(arr, key) {
        let result = -1;

        arr.some((entry, index) => {
            if (entry[0] === key) {
                result = index;

                return true;
            }

            return false;
        });

        return result;
    }

    return class {
        constructor() {
            this.__entries__ = [];
        }

        get size() {
            return this.__entries__.length;
        }

        get(key) {
            const index = getIndex(this.__entries__, key);
            const entry = this.__entries__[index];

            return entry && entry[1];
        }

        set(key, value) {
            const index = getIndex(this.__entries__, key);

            if (~index) {
                this.__entries__[index][1] = value;
            } else {
                this.__entries__.push([key, value]);
            }
        }

        delete(key) {
            const entries = this.__entries__;
            const index = getIndex(entries, key);

            if (~index) {
                entries.splice(index, 1);
            }
        }

        has(key) {
            return !!~getIndex(this.__entries__, key);
        }

        clear() {
            this.__entries__.splice(0);
        }

        forEach(callback, ctx = null) {
            for (const entry of this.__entries__) {
                callback.call(ctx, entry[1], entry[0]);
            }
        }
    };
})();
