import isBrowser from './utils/isBrowser';
import throttle from './utils/throttle';

// Minimum delay before invoking the update of observers.
const REFRESH_DELAY = 20;

// Delay before the next iteration of the continuous cycle.
const CONTINUOUS_DELAY = 80;

// Define whether the MutationObserver is supported.
// eslint-disable-next-line no-extra-parens
const mutationsSupported = (
    typeof MutationObserver == 'function' &&
    // MutationObserver should not be used if running in IE11 as it's
    // implementation is unreliable. Example: https://jsfiddle.net/x2r3jpuz/2/
    // Unfortunately, there is no other way to check this issue but to use
    // userAgent's information.
    typeof navigator == 'object' &&
    !(
        navigator.appName === 'Netscape' &&
        navigator.userAgent.match(/Trident\/.*rv:11/)
    )
);

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
     * @private {boolean}
     */
    isCycleContinuous_ = !mutationsSupported;

    /**
     * Indicates whether DOM listeners have been added.
     *
     * @private {boolean}
     */
    listenersEnabled_ = false;

    /**
     * Keeps reference to the instance of MutationObserver.
     *
     * @private {MutationObserver}
     */
    mutationsObserver_ = null;

    /**
     * A list of connected observers.
     *
     * @private {Array<ResizeObserverSPI>}
     */
    observers_ = [];

    /**
     * Creates a new instance of ResizeObserverController.
     */
    constructor() {
        // Make sure that the "refresh" method is invoked as a RAF callback and
        // that it happens only once during the provided period.
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY, true);

        // Additionally postpone invocation of the continuous updates.
        this.continuousUpdateHandler_ = throttle(this.refresh, CONTINUOUS_DELAY);
    }

    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    connect(observer) {
        if (!this.isConnected(observer)) {
            this.observers_.push(observer);
        }

        // Add listeners if they haven't been added yet.
        if (!this.listenersEnabled_) {
            this.addListeners_();
        }
    }

    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    disconnect(observer) {
        const observers = this.observers_;
        const index = observers.indexOf(observer);

        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }

        // Remove listeners if controller has no connected observers.
        if (!observers.length && this.listenersEnabled_) {
            this.removeListeners_();
        }
    }

    /**
     * Tells whether the provided observer is connected to controller.
     *
     * @param {ResizeObserverSPI} observer - Observer to be checked.
     * @returns {boolean}
     */
    isConnected(observer) {
        return !!~this.observers_.indexOf(observer);
    }

    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes or if continuous updates are enabled.
     *
     * @returns {void}
     */
    refresh() {
        const hasChanges = this.updateObservers_();

        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (hasChanges) {
            this.refresh();
        } else if (this.isCycleContinuous_ && this.listenersEnabled_) {
            // Automatically repeat cycle if it's necessary.
            this.continuousUpdateHandler_();
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
    updateObservers_() {
        // Collect observers that have active entries.
        const active = this.observers_.filter(observer => {
            return observer.gatherActive(), observer.hasActive();
        });

        // Deliver notifications in a separate cycle in order to avoid any
        // collisions between observers. E.g. when multiple instances of
        // ResizeObserer are tracking the same element and the callback of one
        // of them changes content dimensions of the observed target. Sometimes
        // this may result in notifications being blocked for the rest of observers.
        active.forEach(observer => observer.broadcastActive());

        return active.length > 0;
    }

    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    addListeners_() {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this.listenersEnabled_) {
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
            this.mutationsObserver_ = new MutationObserver(this.refresh);

            this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        this.listenersEnabled_ = true;

        // Don't wait for a possible event that might trigger the update of
        // observers and manually initiate the update process.
        if (this.isCycleContinuous_) {
            this.refresh();
        }
    }

    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    removeListeners_() {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this.listenersEnabled_) {
            return;
        }

        window.removeEventListener('resize', this.refresh);
        document.removeEventListener('transitionend', this.refresh);

        if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
        }

        this.mutationsObserver_ = null;
        this.listenersEnabled_ = false;
    }
}
