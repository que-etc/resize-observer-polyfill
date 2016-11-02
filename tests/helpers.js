/**
 * Creates an overlay function over the jasmine "Spy" object with the additional
 * "nextCall" method, which in turn creates a promise that will be resolved on
 * the next invocation of the spy function.
 *
 * @returns {Function}
 */
export function createAsyncSpy() {
    const origSpy = jasmine.createSpy(...arguments);
    const queue = [];

    const asyncSpy = function (...args) {
        // eslint-disable-next-line no-invalid-this
        const result = origSpy.apply(this, args);

        for (const resolve of queue) {
            resolve(args[0]);
        }

        queue.splice(0);

        return result;
    };

    asyncSpy.nextCall = function () {
        return new Promise(resolve => {
            queue.push(resolve);
        });
    };

    Object.assign(asyncSpy, origSpy);

    return asyncSpy;
}

/**
 * Promise wrapper around the "setTimeout" method.
 *
 * @param {Number} timeout
 * @returns {Promise}
 */
export function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
