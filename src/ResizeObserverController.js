import isBrowser from './utils/isBrowser';
import throttle from './utils/throttle';

// Define whether the MutationObserver is supported.
const mutationsSupported = typeof MutationObserver === 'function';

// Minimum delay before invoking the update of observers.
const REFRESH_DELAY = 20;

// Delay before iteration of the continuous cycle.
const CONTINUOUS_HANDLER_DELAY = 80;

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
     * Continuous updates must be enabled if MutationObserver is not supported.
     *
     * @private
     * @type {boolean}
     */
    _isCycleContinuous = !mutationsSupported;

    /**
     * Indicates whether DOM listeners have been added.
     *
     * @private
     * @type {boolean}
     */
    _listenersEnabled = false;

    /**
     * Keeps reference to the instance of MutationObserver.
     *
     * @private
     * @type {MutationObserver}
     */
    _mutationsObserver;

    /**
     * A list of connected observers.
     *
     * @private
     * @type {ResizeObserver[]}
     */
    _observers = [];

    /**
     * Creates a new instance of ResizeObserverController.
     */
    constructor() {
        // Make sure that the "refresh" method is invoked as a RAF callback and
        // that it happens only once during the provided period.
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY, true);

        // Additionally postpone invocation of the continuous updates.
        this._continuousUpdateHandler = throttle(this.refresh, CONTINUOUS_HANDLER_DELAY);
    }

    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserver} observer - Observer to be added.
     * @returns {void}
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
     * @returns {void}
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
     * @returns {boolean}
     */
    isConnected(observer) {
        return !!~this._observers.indexOf(observer);
    }

    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes or if continuous updates are enabled.
     *
     * @returns {void}
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
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *      dimensions of it's elements.
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
     * @returns {void}
     */
    _addListeners() {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this._listenersEnabled) {
            return;
        }

        window.addEventListener('resize', this.refresh);

        // Subscription to the "Transitionend" event is used as a workaround for
        // delayed transitions. This way we can capture at least the final state
        // of an element.
        document.addEventListener('transitionend', this.refresh);

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
     * @returns {void}
     */
    _removeListeners() {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this._listenersEnabled) {
            return;
        }

        window.removeEventListener('resize', this.refresh);
        document.removeEventListener('transitionend', this.refresh);

        if (this._mutationsObserver) {
            this._mutationsObserver.disconnect();
        }

        this._mutationsObserver = null;
        this._listenersEnabled = false;
    }
}
