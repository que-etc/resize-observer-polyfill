import now from './shims/performance.now';
import requestAnimFrame from './shims/requestAnimationFrame';

const mutationsSupported = typeof window.MutationObserver === 'function';

/**
 * Creates a wrapper function which ensures that
 * provided callback will be invoked only once
 * during the specified delay.
 *
 * @param {Function} callback - Function to be invoked.
 * @param {Number} [delay = 0] - Delay after which to invoke callback.
 * @returns {Function}
 */
function debounce(callback, delay = 0) {
    let timeoutID = false;

    return function (...args) {
        if (timeoutID !== false) {
            clearTimeout(timeoutID);
        }

        timeoutID = setTimeout(() => {
            timeoutID = false;

            /* eslint-disable no-invalid-this */
            callback.apply(this, args);

            /* eslint-enable no-invalid-this */
        }, delay);
    };
}

/**
 * Controller class which handles updates of ResizeObserver instances.
 * It's meant to decide when and for how long it's necessary to run updates by listening to the windows
 * "resize" event along with a tracking of DOM mutations (nodes removal, changes of attributes, etc.).
 *
 * Transitions and animations are handled by running a repeatable update cycle either until the dimensions
 * of observed elements are changing or the timeout is reached (default timeout is 50 milliseconds).
 * Timeout value can be manually increased if transitions have a delay.
 *
 * Continuous update cycle will be used automatically in case if MutationObserver is not supported.
 */
export default class ResizeObserverController {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @param {Number} [idleTimeout = 0] - Idle timeout value.
     * @param {Boolean} [continuousUpdates = false] - Whether to use a continuous update cycle.
     */
    constructor(idleTimeout = 50, continuousUpdates = false) {
        this._idleTimeout = idleTimeout;
        this._isCycleContinuous = continuousUpdates;

        this._cycleStartTime = 0;

        // Indicates whether the update cycle is currently running.
        this._isCycleActive = false;

        // Indicates whether the update of observers is scheduled.
        this._isUpdateScheduled = false;

        // Indicates whether DOM listeners have been added.
        this._listenersEnabled = false;

        // Keeps reference to the instance of MutationObserver.
        this._mutationsObserver = null;

        // A list of connected observers.
        this._observers = [];

        // Fix value of "this" binding for the following methods.
        this.runUpdates = this.runUpdates.bind(this);
        this._resolveScheduled = this._resolveScheduled.bind(this);
        this._onMutation = this._onMutation.bind(this);

        // Function that will be invoked to re-run the
        // update cycle if continuous cycles are enabled.
        this._continuousCycleHandler = debounce(this.runUpdates, 200);
    }

    /**
     * Returns current idle timeout value.
     *
     * @returns {Number}
     */
    get idleTimeout() {
        return this._idleTimeout;
    }

    /**
     * Sets up new idle timeout value.
     *
     * @param {Number} value - New timeout value.
     */
    set idleTimeout(value) {
        this._idleTimeout = value;
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
     * @param {Boolean} value - Whether to enable or disable
     *      continuous updates. Note that the value won't be applied
     *      if MutationObserver is not supported.
     */
    set continuousUpdates(value) {
        if (mutationsSupported) {
            this._isCycleContinuous = value;
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
        let observers = this._observers,
            index = observers.indexOf(observer);

        if (~index) {
            observers.splice(index, 1);
        }

        // Remove listeners if controller
        // has no connected observers.
        if (!observers.length && this._listenersEnabled) {
            this._removeListeners();
        }
    }

    /**
     * Tells whether provided observer is connected to controller.
     *
     * @param {ResizeObserver} observer - Observer to be checked.
     * @returns {Boolean}
     */
    isConnected(observer) {
        return !!~this._observers.indexOf(observer);
    }

    /**
     * Updates every observer from observers list and
     * notifies them of queued entries.
     *
     * @private
     * @returns {Boolean} Returns "true" if any observer
     *      has detected changes in dimensions of its' elements.
     */
    _updateObservers() {
        let hasChanges = false;

        for (const observer of this._observers) {
            observer.gatherActive();

            if (observer.hasActive()) {
                hasChanges = true;

                observer.broadcastActive();
            }
        }

        return hasChanges;
    }

    /**
     * Starts the update cycle which will run either
     * until it detects changes in the dimensions of
     * elements or the idle timeout is reached.
     */
    runUpdates() {
        this._cycleStartTime = now();
        this._isCycleActive = true;

        this.scheduleUpdate();
    }

    /**
     * Schedules the update of observers.
     *
     * @private
     */
    scheduleUpdate() {
        if (!this._isUpdateScheduled) {
            this._isUpdateScheduled = true;

            requestAnimFrame(this._resolveScheduled);
        }
    }

    /**
     * Invokes the update of observers. It may re-run the
     * cycle if changes in observers have been detected.
     *
     * @private
     */
    _resolveScheduled() {
        const hasChanges = this._updateObservers();

        this._isUpdateScheduled = false;

        // Do nothing if cycle wasn't started.
        if (!this._isCycleActive) {
            return;
        }

        // Re-start cycle if changes have been detected.
        if (hasChanges) {
            this.runUpdates();
        } else if (this._hasRemainingTime()) {
            this.scheduleUpdate();
        } else {
            this._endUpdates();
        }
    }

    /**
     * Tells whether the update cycle has time remaining.
     *
     * @private
     * @returns {Boolean}
     */
    _hasRemainingTime() {
        const timePassed = now() - this._cycleStartTime;

        return this._idleTimeout - timePassed > 0;
    }

    /**
     * Callback which is invoked when update cycle
     * is finished. It may start a new cycle if continuous
     * updates are enabled.
     *
     * @private
     */
    _endUpdates() {
        this._isCycleActive = false;

        if (this._isCycleContinuous && this._listenersEnabled) {
            this._continuousCycleHandler();
        }
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

        this._listenersEnabled = true;

        // Repeatable cycle is used here because the resize event may
        // lead to continuous changes, e.g. when width or height of an element
        // are controlled by CSS transitions.
        window.addEventListener('resize', this.runUpdates);

        // Fall back to an infinite cycle.
        if (!mutationsSupported) {
            this._isCycleContinuous = true;

            this.runUpdates();
        } else {
            // Subscribe to DOM mutations as they may lead to
            // changes in dimensions of elements.
            this._mutationsObserver = new MutationObserver(this._onMutation);

            this._mutationsObserver.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
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

        window.removeEventListener('resize', this.runUpdates);

        if (this._mutationsObserver) {
            this._mutationsObserver.disconnect();
        }

        this._mutationsObserver = null;
        this._listenersEnabled = false;
    }

    /**
     * DOM mutations handler.
     *
     * @private
     * @param {Array<MutationRecord>} entries - An array of mutation records.
     */
    _onMutation(entries) {
        // Check if at least one entry
        // contains attributes changes.
        const attrsChanged = entries.some(entry => {
            return entry.type === 'attributes';
        });

        // It's expected that animations may start only
        // after some attribute changes its' value.
        attrsChanged ?
            this.runUpdates() :
            this.scheduleUpdate();
    }
}
