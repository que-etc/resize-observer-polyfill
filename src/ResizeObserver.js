import isBrowser from './utils/isBrowser';
import {WeakMap} from './shims/es6-collections';
import ResizeObserverController from './ResizeObserverController';
import _ResizeObserver from './_ResizeObserver';

export default (function () {
    // Fall back to a class with empty functions if running in a non-browser
    // environment.
    if (!isBrowser) {
        /* eslint-disable */
        class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
        /* eslint-enable */

        ResizeObserver.continuousUpdates = false;

        return ResizeObserver;
    }

    // Controller that will be assigned to all instances of ResizeObserver.
    const controller = new ResizeObserverController();

    // Registry of the internal observers.
    const observers = new WeakMap();

    /**
     * ResizeObservers' "Proxy" class which is meant to hide private properties and
     * methods from public instances.
     *
     * Additionally implements the "continuousUpdates" static property accessor to
     * give control over the behavior of the ResizeObserverController instance.
     * Changes made to this property affect all future and existing observers.
     */
    class ResizeObserver {
        /**
         * Creates a new instance of ResizeObserver.
         *
         * @param {Function} callback - Callback that is invoked when dimensions of
         *      one of the observed elements change.
         */
        constructor(callback) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }

            // Create a new instance of the internal ResizeObserver.
            const observer = new _ResizeObserver(callback, controller, this);

            // Register internal observer.
            observers.set(this, observer);
        }

        /**
         * Tells whether continuous updates are enabled.
         *
         * @returns {Boolean}
         */
        static get continuousUpdates() {
            return controller.continuousUpdates;
        }

        /**
         * Enables or disables continuous updates.
         *
         * @param {Boolean} value - Whether to enable or disable continuous updates.
         */
        static set continuousUpdates(value) {
            if (typeof value !== 'boolean') {
                throw new TypeError('type of "continuousUpdates" value must be boolean.');
            }

            controller.continuousUpdates = value;
        }
    }

    // Expose public methods of ResizeObserver.
    [
        'observe',
        'unobserve',
        'disconnect'
    ].forEach(method => {
        ResizeObserver.prototype[method] = function () {
            if (isBrowser) {
                observers.get(this)[method](...arguments);
            }
        };
    });

    return ResizeObserver;
})();
