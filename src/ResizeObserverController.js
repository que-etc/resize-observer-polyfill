import throttle from './throttle';

// Define whether the MutationObserver is supported.
const mutationsSupported = typeof window.MutationObserver === 'function';

/**
 * Controller class which handles updates of ResizeObserver instances.
 * It decides when and for how long it's necessary to run updates by listening
 * to the windows "resize" event along with a tracking of DOM mutations
 * (nodes removal, changes of attributes, etc.).
 *
 * Transitions and animations are handled by running a repeatable update cycle
 * until the dimensions of observed elements are changing.
 *
 * Continuous update cycle will be used automatically in case MutationObserver
 * is not supported.
 */
export default class ResizeObserverController {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @param {Boolean} [continuousUpdates = false] - Whether to use a continuous
     *      update cycle.
     */
    constructor(continuousUpdates = false) {
        // Continuous updates must be enabled if MutationObserver is not supported.
        this._isCycleContinuous = !mutationsSupported || continuousUpdates;

        // Indicates whether DOM listeners have been added.
        this._listenersEnabled = false;

        // Keeps reference to the instance of MutationObserver.
        this._mutationsObserver = null;

        // A list of connected observers.
        this._observers = [];

        // Make sure that the "refresh" method is invoked as a RAF callback and
        // that it happens only once during the period of 30 milliseconds.
        this.refresh = throttle(this.refresh.bind(this), 30, true);

        // Additionally postpone invocation of the continuous updates.
        this._continuousUpdateHandler = throttle(this.refresh, 70);
    }

    /**
     * Tells whether continuous updates are enabled.
     *
     * @returns {Boolean}
     */
    get continuousUpdates() {
        return this._isCycleContinuous;
    }

    /**
     * Enables or disables continuous updates.
     *
     * @param {Boolean} useContinuous - Whether to enable or disable continuous
     *      updates. Note that the value won't be applied if MutationObserver is
     *      not supported.
     */
    set continuousUpdates(useContinuous) {
        // The state of continuous updates should not be modified if
        // MutationObserver is not supported.
        if (!mutationsSupported) {
            return;
        }

        this._isCycleContinuous = useContinuous;

        // Immediately start the update cycle in order not to wait for a possible
        // event that might initiate it.
        if (this._listenersEnabled && useContinuous) {
            this.refresh();
        }
    }

    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserver} observer - Observer to be added.
     */
    connect(observer) {
        if (!this.isConnected(observer)) {
            this._observers.push(observer);
        }

        // Add listeners if they haven't been added yet.
        if (!this._listenersEnabled) {
            this._addListeners();
        }
    }

    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserver} observer - Observer to be removed.
     */
    disconnect(observer) {
        const observers = this._observers;
        const index = observers.indexOf(observer);

        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }

        // Remove listeners if controller has no connected observers.
        if (!observers.length && this._listenersEnabled) {
            this._removeListeners();
        }
    }

    /**
     * Tells whether the provided observer is connected to controller.
     *
     * @param {ResizeObserver} observer - Observer to be checked.
     * @returns {Boolean}
     */
    isConnected(observer) {
        return !!~this._observers.indexOf(observer);
    }

    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes or if continuous updates are enabled.
     */
    refresh() {
        const hasChanges = this._updateObservers();

        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (hasChanges) {
            this.refresh();
        } else if (this._isCycleContinuous && this._listenersEnabled) {
            // Automatically repeat cycle if it's necessary.
            this._continuousUpdateHandler();
        }
    }

    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {Boolean} Returns "true" if any observer has detected changes in
     *      dimensions of its' elements.
     */
    _updateObservers() {
        let hasChanges = false;

        for (const observer of this._observers) {
            // Collect active observations.
            observer.gatherActive();

            // Broadcast active observations and set the flag that changes have
            // been detected.
            if (observer.hasActive()) {
                hasChanges = true;

                observer.broadcastActive();
            }
        }

        return hasChanges;
    }

    /**
     * Initializes DOM listeners.
     *
     * @private
     */
    _addListeners() {
        // Do nothing if listeners have been already added.
        if (this._listenersEnabled) {
            return;
        }

        window.addEventListener('resize', this.refresh);

        // Subscribe to DOM mutations if it's possible as they may lead to
        // changes in the dimensions of elements.
        if (mutationsSupported) {
            this._mutationsObserver = new MutationObserver(this.refresh);

            this._mutationsObserver.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        this._listenersEnabled = true;

        // Don't wait for a possible event that might trigger the update of
        // observers and manually initiate the update process.
        if (this._isCycleContinuous) {
            this.refresh();
        }
    }

    /**
     * Removes DOM listeners.
     *
     * @private
     */
    _removeListeners() {
        // Do nothing if listeners have been already removed.
        if (!this._listenersEnabled) {
            return;
        }

        window.removeEventListener('resize', this.refresh);

        if (this._mutationsObserver) {
            this._mutationsObserver.disconnect();
        }

        this._mutationsObserver = null;
        this._listenersEnabled = false;
    }
}
