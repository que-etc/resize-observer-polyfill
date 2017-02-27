/* eslint-disable max-nested-callbacks, no-shadow, require-jsdoc */
import ResizeObserver from '../../src/index';

let observer;

// eslint-disable-next-line no-empty-function
const emptyFn = () => {};

describe('ResizeObserver', () => {
    afterEach(() => {
        if (observer) {
            observer.disconnect();
        }

        observer = null;
    });

    describe('constructor', () => {
        it('throws an error if no arguments are provided', () => {
            expect(() => {
                observer = new ResizeObserver();
            }).toThrowError(/1 argument required/i);
        });

        it('throws an error if callback is not a function', () => {
            expect(() => {
                observer = new ResizeObserver(true);
            }).toThrowError(/function/i);

            expect(() => {
                observer = new ResizeObserver({});
            }).toThrowError(/function/i);

            expect(() => {
                observer = new ResizeObserver(emptyFn);
            }).not.toThrow();
        });
    });

    describe('observe', () => {
        it('throws an error if no arguments are provided', () => {
            observer = new ResizeObserver(emptyFn);

            expect(() => {
                observer.observe();
            }).toThrowError(/1 argument required/i);

            expect(() => {
                observer.observe({});
            }).not.toThrow();
        });
    });

    describe('unobserve', () => {
        it('throws an error if no arguments are provided', () => {
            observer = new ResizeObserver(emptyFn);

            expect(() => {
                observer.unobserve();
            }).toThrowError(/1 argument required/i);

            expect(() => {
                observer.unobserve({});
            }).not.toThrow();
        });
    });

    describe('disconnect', () => {
        it('doesnt throw an error', () => {
            observer = new ResizeObserver(emptyFn);

            expect(() => {
                observer.disconnect();
            }).not.toThrow();
        });
    });
});
