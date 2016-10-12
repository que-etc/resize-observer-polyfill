/**
 * A collection of shims that provides minimal
 * support of WeakMap and Map classes.
 *
 * These implementations are not meant to be used outside of
 * ResizeObserver modules as they cover only a limited range
 * of use cases.
 */

/* eslint-disable require-jsdoc */
const hasNativeCollections =
    typeof window.WeakMap === 'function' &&
    typeof window.Map === 'function';

const WeakMap = (() => {
    if (hasNativeCollections) {
        return window.WeakMap;
    }

    function getIndex(arr, key) {
        let result = -1;

        arr.some((entry, index) => {
            let matches = entry[0] === key;

            if (matches) {
                result = index;
            }

            return matches;
        });

        return result;
    }

    return class {
        constructor() {
            this.__entries__ = [];
        }

        get(key) {
            let index = getIndex(this.__entries__, key);

            return this.__entries__[index][1];
        }

        set(key, value) {
            let index = getIndex(this.__entries__, key);

            if (~index) {
                this.__entries__[index][1] = value;
            } else {
                this.__entries__.push([key, value]);
            }
        }

        delete(key) {
            let entries = this.__entries__,
                index = getIndex(entries, key);

            if (~index) {
                entries.splice(index, 1);
            }
        }

        has(key) {
            return !!~getIndex(this.__entries__, key);
        }
    };
})();

const Map = (() => {
    if (hasNativeCollections) {
        return window.Map;
    }

    return class extends WeakMap {
        get size() {
            return this.__entries__.length;
        }

        clear() {
            this.__entries__.splice(0, this.__entries__.length);
        }

        entries() {
            return this.__entries__.slice();
        }

        keys() {
            return this.__entries__.map(entry => entry[0]);
        }

        values() {
            return this.__entries__.map(entry => entry[1]);
        }

        forEach(callback, ctx = null) {
            for (const entry of this.__entries__) {
                callback.call(ctx, entry[1], entry[0]);
            }
        }
    };
})();

export {Map, WeakMap};
