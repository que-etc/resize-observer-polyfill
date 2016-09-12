import {Map} from './shims/es6-collections';
import ResizeObservation from './ResizeObservation';
import ResizeObserverEntry from './ResizeObserverEntry';

export default class ResizeObserver {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {Function} callback - Callback function which will be invoked
     *      when one of the observed elements changes its' content rectangle.
     * @param {ResizeObsreverController} controller - Controller instance
     *      which is responsible for the updates of observer.
     * @param {ResizeObserver} publicObserver - Reference
     *      to the public ResizeObserver instance which will be passed
     *      to callback function.
     */
    constructor(callback, controller, publicObserver) {
        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }

        // Reference to the callback function.
        this._callback = callback;

        // A registry of ResizeObservation instances.
        this._targets = new Map();

        // A collection of resize observations that have detected
        // changes in dimensions of elements.
        this._activeTargets = [];

        // Reference to associated ResizeObserverController.
        this._controller = controller;

        // Public ResizeObserver instance which will be passed
        // to callback function.
        this._publicObserver = publicObserver;
    }

    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     */
    observe(target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        if (!(target instanceof Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }

        const targets = this._targets;

        // Do nothing if element is already being observed.
        if (targets.has(target)) {
            return;
        }

        targets.set(target, new ResizeObservation(target));

        // Add observer to controller
        // if it hasn't been connected yet.
        if (!this._controller.isConnected(this)) {
            this._controller.connect(this);
        }

        // Update observations.
        this._controller.runUpdates();
    }

    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     */
    unobserve(target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        if (!(target instanceof Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }

        const targets = this._targets;

        // Do nothing if element is not being observed.
        if (!targets.has(target)) {
            return;
        }

        // Remove element and an associated with
        // it ResizeObsrvation instance from registry.
        targets.delete(target);

        if (!targets.size) {
            this.disconnect();
        }
    }

    /**
     * Stops observing all elements and
     * clears the observations list.
     */
    disconnect() {
        this.clearActive();
        this._targets.clear();

        this._controller.disconnect(this);
    }

    /**
     * Invokes initial callback function with a list
     * of ResizeObserverEntry instances collected from
     * active resize observations.
     */
    broadcastActive() {
        if (!this.hasActive()) {
            return;
        }

        const publicObserver = this._publicObserver;

        const entries = this._activeTargets.map(observation => {
            return new ResizeObserverEntry(
                observation.target,
                observation.broadcastRect()
            );
        });

        this.clearActive();

        this._callback.call(publicObserver, entries, publicObserver);
    }

    /**
     * Clears the collection of pending/active observations.
     */
    clearActive() {
        this._activeTargets.splice(0);
    }

    /**
     * Tells whether the observer has
     * pending observations.
     *
     * @returns {Boolean}
     */
    hasActive() {
        return !!this._activeTargets.length;
    }

    /**
     * Clears an array of previously collected active observations
     * and collects observation instances whose associated element
     * has changes in its' content rectangle.
     */
    gatherActive() {
        this.clearActive();

        const activeTargets = this._activeTargets;

        this._targets.forEach(observation => {
            if (observation.isActive()) {
                activeTargets.push(observation);
            }
        });
    }
}
