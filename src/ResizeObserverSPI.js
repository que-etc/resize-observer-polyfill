import {Map} from './shims/es6-collections.js';
import ResizeObservation from './ResizeObservation.js';
import ResizeObserverEntry from './ResizeObserverEntry.js';
import getRootNode from './shims/getRootNode';
import getWindowOf from './utils/getWindowOf.js';

// Check if IntersectionObserver is available.
const intersectionObserverSupported = typeof IntersectionObserver !== 'undefined';

export default class ResizeObserverSPI {
    /**
     * Collection of resize observations that have detected changes in dimensions
     * of elements.
     *
     * @private {Array<ResizeObservation>}
     */
    activeObservations_ = [];

    /**
     * Reference to the callback function.
     *
     * @private {ResizeObserverCallback}
     */
    callback_;

    /**
     * Public ResizeObserver instance which will be passed to the callback
     * function and used as a value of it's "this" binding.
     *
     * @private {ResizeObserver}
     */
    callbackCtx_;

    /**
     * Reference to the associated GlobalResizeObserverController.
     *
     * @private {GlobalResizeObserverController}
     */
    controller_;

    /**
     * Registry of the ResizeObservation instances.
     *
     * @private {Map<Element, ResizeObservation>}
     */
    observations_ = new Map();

    /**
     * The mapping between a root node and a set of targets tracked within
     * this root node.
     *
     * @private {Map<Node, Array<Element>>}
     */
    rootNodes_ = new Map();

    /**
     * An instance of the intersection observer when available. There are a
     * lot more browser versions that support the `IntersectionObserver`, but
     * not the `ResizeObserver`. When `IntersectionObserver` is available it
     * can be used to pick up DOM additions and removals more timely without
     * significant costs.
     *
     * @private {IntersectionObserver}
     */
    intersectionObserver_ = null;

    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback function that is invoked
     *      when one of the observed elements changes it's content dimensions.
     * @param {GlobalResizeObserverController} controller - Controller instance which
     *      is responsible for the updates of observer.
     * @param {ResizeObserver} callbackCtx - Reference to the public
     *      ResizeObserver instance which will be passed to callback function.
     */
    constructor(callback, controller, callbackCtx) {
        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }

        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;

        if (intersectionObserverSupported) {
            this.intersectionObserver_ = new IntersectionObserver(() => this.checkRootChanges_());
        }
    }

    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */
    observe(target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }

        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }

        const observations = this.observations_;

        // Do nothing if element is already being observed.
        if (observations.has(target)) {
            return;
        }

        const rootNode = getControlledRootNode(target, target.ownerDocument);

        observations.set(target, new ResizeObservation(target, rootNode));

        let rootNodeTargets = this.rootNodes_.get(rootNode);

        if (!rootNodeTargets) {
            rootNodeTargets = [];
            this.rootNodes_.set(rootNode, rootNodeTargets);
            this.controller_.addObserver(rootNode, this);
        }
        rootNodeTargets.push(target);

        if (this.intersectionObserver_) {
            this.intersectionObserver_.observe(target);
        }

        // Force the update of observations.
        this.controller_.refresh(rootNode);
    }

    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    unobserve(target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }

        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }

        const observations = this.observations_;
        const observation = observations.get(target);

        // Do nothing if element is not being observed.
        if (!observation) {
            return;
        }

        observations.delete(target);

        if (this.intersectionObserver_) {
            this.intersectionObserver_.unobserve(target);
        }

        // Disconnect the root if no longer used.
        const {rootNode} = observation;
        const rootNodeTargets = this.rootNodes_.get(rootNode);

        if (rootNodeTargets) {
            const index = rootNodeTargets.indexOf(target);

            if (~index) {
                rootNodeTargets.splice(index, 1);
            }
            if (rootNodeTargets.length === 0) {
                this.rootNodes_.delete(rootNode);
                this.controller_.removeObserver(rootNode, this);
            }
        }
    }

    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    disconnect() {
        this.clearActive();
        this.observations_.clear();
        this.rootNodes_.forEach((_, rootNode) => {
            this.controller_.removeObserver(rootNode, this);
        });
        this.rootNodes_.clear();
        if (this.intersectionObserver_) {
            this.intersectionObserver_.disconnect();
            this.intersectionObserver_ = null;
        }
    }

    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    gatherActive() {
        this.checkRootChanges_();

        this.clearActive();

        this.observations_.forEach(observation => {
            if (observation.isActive()) {
                this.activeObservations_.push(observation);
            }
        });
    }

    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    broadcastActive() {
        // Do nothing if observer doesn't have active observations.
        if (!this.hasActive()) {
            return;
        }

        const ctx = this.callbackCtx_;

        // Create ResizeObserverEntry instance for every active observation.
        const entries = this.activeObservations_.map(observation => {
            return new ResizeObserverEntry(
                observation.target,
                observation.broadcastRect()
            );
        });

        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
    }

    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    clearActive() {
        this.activeObservations_.splice(0);
    }

    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    hasActive() {
        return this.activeObservations_.length > 0;
    }

    /**
     * Check if any of the targets have changed the root node. For instance,
     * an element could be moved from the main DOM to a shadow root.
     *
     * @private
     * @returns {void}
     */
    checkRootChanges_() {
        let changedRootTargets = null;

        this.observations_.forEach(observation => {
            const {target, rootNode: oldRootNode} = observation;
            const rootNode = getControlledRootNode(target, oldRootNode);

            if (rootNode !== oldRootNode) {
                if (!changedRootTargets) {
                    changedRootTargets = [];
                }
                changedRootTargets.push(target);
            }
        });

        if (changedRootTargets) {
            changedRootTargets.forEach(target => {
                this.unobserve(target);
                this.observe(target);
            });
        }
    }
}

/**
 * Find the most appropriate root node that should be monitored for events
 * related to this target.
 *
 * @param {Node} target
 * @param {Node} def
 * @returns {Node}
 */
function getControlledRootNode(target, def) {
    const rootNode = getRootNode(target);

    // DOCUMENT_NODE = 9
    // DOCUMENT_FRAGMENT_NODE = 11 (shadow root)
    if (rootNode.nodeType === 9 ||
        rootNode.nodeType === 11) {
        return rootNode;
    }

    return def;
}
