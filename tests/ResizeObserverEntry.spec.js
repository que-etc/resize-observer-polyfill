/* eslint-disable max-nested-callbacks, require-jsdoc */
import {ResizeObserver} from './resources/observer';

const NEW_VALUE = Date.now();

/**
 * Checks whether the specified property is present in provided object
 * and that it's neither enumerable nor writable.
 *
 * @param {Object} target
 * @param {string} prop
 * @returns {boolean}
 */
function isReadOnlyAttr(target, prop) {
    if (!(prop in target)) {
        return false;
    }

    const keys = Object.keys(target);

    // Property shouldn't be enumerable.
    if (~keys.indexOf(prop)) {
        return false;
    }

    // Property shouldn't be writable.
    try {
        target[prop] = NEW_VALUE;
    } catch (e) {
        // An error is expected in 'strict' mode
        // for the major browsers.
    }

    if (target[prop] === NEW_VALUE) {
        return false;
    }

    // Properties' descriptor can be changed.
    try {
        Object.defineProperty(target, prop, {
            value: NEW_VALUE
        });
    } catch (e) {
        // If property is configurable
        // an error shouldn't be thrown.
        return false;
    }

    return target[prop] === NEW_VALUE;
}

function getEntry() {
    return new Promise(resolve => {
        const observer = new ResizeObserver(entries => {
            observer.disconnect();

            resolve(entries[0]);
        });

        observer.observe(document.body);
    });
}

describe('ResizeObserverEntry', () => {
    describe('constructor', () => {
        it('properties are readonly and not enumerable', done => {
            getEntry().then(entry => {
                expect(isReadOnlyAttr(entry, 'target')).toBe(true);
                expect(isReadOnlyAttr(entry, 'contentRect')).toBe(true);
            }).then(done);
        });

        it('content rectangle is an instance of the DOMRectReadOnly', done => {
            getEntry().then(entry => {
                const rectKeys = ['x', 'y', 'width', 'height', 'top', 'right', 'bottom', 'left'];
                const {contentRect} = entry;

                if (typeof DOMRectReadOnly === 'function') {
                    expect(Object.getPrototypeOf(contentRect)).toBe(DOMRectReadOnly.prototype);
                }

                for (const key of rectKeys) {
                    expect(isReadOnlyAttr(contentRect, key)).toBe(true);
                }
            }).then(done);
        });
    });
});
