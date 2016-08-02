import now from './shims/performance.now';
import requestAnimFrame from './shims/requestAnimationFrame';

import * as animations from './animations';

const mutationsSupported = typeof window.MutationObserver === 'function';


/**
 * Creates a wrapper function which ensures that
 * provided callback will be invoked only one
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

            callback.apply(this, args);
        }, delay);
    };
}

/**
 * Controller class which is used to handle the updates of registered ResizeObservers instances.
 * It controls when and for how long it's necessary to run updates by listening to a combination
 * of DOM events along with a track of DOM mutations (nodes removal, changes of attributes, etc.).
 *
 * Transitions and animations are handled by listening to "transitionstart"/"animationstart"
 * events or by using documents' "getAnimations" method if it's available. If none of the above
 * is supported then a repeatable update cycle will be used. It will run until the dimensions
 * of observed elements are changing or until the timeout is reached (default timeout is 50 milliseconds).
 * Timeout value can be manually increased if transitions have a delay.
 *
 * Tracking of changes caused by ":hover" class is optional and can be enabled by invoking
 * the "enableHover" method.
 *
 * Infinite update cycle along with a listener for "click" event will be used in case when
 * MutatioObserver is not supported.
 */
export default class ResizeObserverController {
    /**
     * Creates new ResizeObserverController instance.
     *
     * @param {Number} [idleTimeout = 0]
     * @pram {Boolean} [trackHovers = false] - Whether to track "mouseover"
     *      events or not. Disabled be default.
     */
    constructor(idleTimeout = 50, trackHovers = false) {
        this._idleTimeout = idleTimeout;
        this._trackHovers = trackHovers;
        this._cycleStartTime = 0;
        this._cycleDuration = 0;
        this._cycleHadChanges = false;

        this._isCycleRepeatable = false;

        // Indicates whether the update of observers is scheduled.
        this._isScheduled = false;

        // Indicates whether infinite cycles are enabled.
        this._isCycleInfinite = false;

        // Indicates whether "mouseover" event handler was added.
        this._hoverInitiated = false;

        // Keeps reference to the instance of MutationObserver.
        this._mutationsObserver = null;

        // Indicates whether DOM listeners were initiated.
        this._isListening = false;

        // A list of connected observers.
        this._observers = [];

        // Fix value of "this" binding for the following methods.
        this.runUpdates = this.runUpdates.bind(this);
        this._startAnimationCycle = this._startAnimationCycle.bind(this);
        this._resolveScheduled = this._resolveScheduled.bind(this);
        this._onMutation = this._onMutation.bind(this);
        this._onAnimationStart = this._onAnimationStart.bind(this);
        this._onTransitionStart = this._onTransitionStart.bind(this);

        // Make sure that the update won't start immediately.
        // Required to handle animations with 'getAnimations' method.
        this._scheduleUpdate = debounce(this._scheduleUpdate, 5);

        // Function that will be invoked to re-run the
        // update cycle if infinite cycles are enabled.
        this._inifiniteCycleHandler = debounce(this._startAnimationCycle, 300);

        // Limit the amount of calls from "mouseover" event.
        this._onHover = debounce(this._startAnimationCycle, 200);
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
     * Adds observer to observers list.
     *
     * @param {ResizeObserver} observer - Observer to be added.
     */
    connect(observer) {
        if (!this.isConnected(observer)) {
            this._observers.push(observer);
        }

        // Add listeners if they
        // haven't been instantiated yet.
        if (!this._isListening) {
            this._initListeners();
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
        if (!observers.length && this._isListening) {
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
     * @returns {Boolean} Returns "true" if some observer
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
     * Starts the update cycle which will run either until there
     * are active animations or until specified minimal
     * duration is reached.
     *
     * Cycle will repeat itself if one of its' iterations
     * has detected changes in observers and if "repeatable" parameter
     * is set to "true". Repeatable cycles are used to handle
     * animations and transitions.
     *
     * @param {Number} [minDuration = 0] - Minimal duration of cycle.
     * @param {Boolean} [repeatable = false] - Whether it is necessary
     *      to repeat cycle when it detects changes.
     */
    runUpdates(minDuration = 0, repeatable = false) {
        if (typeof minDuration !== 'number') {
            minDuration = 0;
        }

        if (!this._isCycleRepeatable) {
            this._isCycleRepeatable = repeatable;
        }

        // Update cycles' start time and duration if its'
        // remaining time is lesser than provided duration.
        if (minDuration >= this._getRemainingTime()) {
            this._cycleStartTime = now();
            this._cycleDuration = minDuration;
        }

        this._scheduleUpdate();
    }

    /**
     * Checks if it's possible to detect active animations and invokes
     * a single update if it's so. Otherwise it will
     * start a repeatable cycle using provided duration.
     *
     * @private
     * @param {Number} [duration = this._idleTimeout] - Duration of cycle.
     */
    _startAnimationCycle(duration) {
        if (typeof duration !== 'number') {
            duration = this._idleTimeout;
        }

        !this._canDetectAnimations() ?
            this.runUpdates(duration, true) :
            this.runUpdates();
    }

    /**
     * Schedules the update of observers. Uses
     * requestAnimationFrame to match the most
     * appropriate time of invocation.
     *
     * @private
     */
    _scheduleUpdate() {
        if (!this._isScheduled) {
            this._isScheduled = true;

            requestAnimFrame(this._resolveScheduled);
        }
    }

    /**
     * Invokes the update of observers. It will schedule
     * new update if there are active animations or if
     * minimal duration of the update cycle wasn't reached yet.
     *
     * @private
     */
    _resolveScheduled() {
        this._isScheduled = false;

        // Set a flag that changes in
        // observers were detected.
        if (this._updateObservers()) {
            this._cycleHadChanges = true;
        }

        this._shouldContinueUpdating() ?
            this._scheduleUpdate() :
            this._endUpdates();
    }

    /**
     * Tells whether it's necessary to continue
     * running updates or that the update cycle can be finished.
     *
     * @returns {Boolean}
     */
    _shouldContinueUpdating() {
        return (
            animations.hasReflowAnimations() ||
            this._getRemainingTime() > 0
        );
    }

    /**
     * Computes remaining time of the update cycle.
     *
     * @private
     * @returns {Number} Remaining time in milliseconds.
     */
    _getRemainingTime() {
        const timePassed = now() - this._cycleStartTime;

        return Math.max(this._cycleDuration - timePassed, 0);
    }

    /**
     * Callback that will be invoked after
     * the update cycle is finished.
     *
     * @private
     */
    _endUpdates() {
        // We don't need to repeat the cycle if it's
        // previous iteration detected no changes.
        if (!this._cycleHadChanges) {
            this._isCycleRepeatable = false;
        }

        this._cycleHadChanges = false;

        // Repeat cycle if it's necessary.
        if (this._isCycleRepeatable) {
            this.runUpdates(this._cycleDuration);
        } else if (this._isCycleInfinite) {
            this._inifiniteCycleHandler();
        }
    }

    /**
     * Initializes DOM listeners.
     *
     * @private
     */
    _initListeners() {
        // Do nothing if listeners are already initiated.
        if (this._isListening) {
            return;
        }

        this._isListening = true;

        // Repeatable cycle is used here because the resize event may
        // lead to continuous changes, e.g. when width or height of elements
        // are controlled by CSS transitions.
        window.addEventListener('resize', this._startAnimationCycle, true);

        if (!animations.isGetAnimationsSupported()) {
            document.addEventListener('transitionstart', this._onTransitionStart, true);
            document.addEventListener('animationstart', this._onAnimationStart, true);
        }

        if (this.isHoverEnabled()) {
            this._addHoverListener();
        }

        // Fall back to an infinite cycle with additional tracking of
        // "click" event if MutationObserver is not supported.
        if (!mutationsSupported) {
            this._isCycleInfinite = true;

            // Listen to clicks as they may cause changes in elements position.
            document.addEventListener('click', this._startAnimationCycle, true);

            // Manually start cycle.
            this.runUpdates();
        } else {
            // Subscribe to DOM mutations as they may lead to changes in dimensions of elements.
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
     * Removes all DOM listeners.
     *
     * @private
     */
    _removeListeners() {
        // Do nothing if listeners were already removed.
        if (!this._isListening) {
            return;
        }

        window.removeEventListener('resize', this._startAnimationCycle, true);

        document.removeEventListener('click', this._startAnimationCycle, true);
        document.removeEventListener('animationstart', this._onAnimationStart, true);
        document.removeEventListener('transitionstart', this._onTransitionStart, true);

        this._removeHoverListener();

        if (this._mutationsObserver) {
            this._mutationsObserver.disconnect();
        }

        this._mutationsObserver = null;
        this._repeatCycle = false;
        this._isListening = false;
    }

    /**
     * Enables hover listener.
     */
    enableHover() {
        this._trackHovers = true;

        // Immediately add listener if the rest
        // of listeners were already initiated.
        if (this._isListening) {
            this._addHoverListener();
        }
    }

    /**
     * Disables hover listener.
     */
    disableHover() {
        this._trackHovers = false;

        this._removeHoverListener();
    }

    /**
     * Tells whether hover listener is enabled.
     *
     * @returns {Boolean}
     */
    isHoverEnabled() {
        return this._trackHovers;
    }

    /**
     * Adds "mouseover" listener tho the document
     * if it hasn't been already added.
     *
     * @private
     */
    _addHoverListener() {
        if (!this._hoverInitiated) {
            this._hoverInitiated = true;

            document.addEventListener('mouseover', this._onHover, true);
        }
    }

    /**
     * Removes "mouseover" listener from document
     * if it was added previously.
     *
     * @private
     */
    _removeHoverListener() {
        if (this._hoverInitiated) {
            this._hoverInitiated = false;

            document.removeEventListener('mouseover', this._onHover, true);
        }
    }

    /**
     * Tells whether it's possible to detect active animations
     * either by using 'getAnimations' method or by listening
     * to "transitionstart" event.
     *
     * @private
     * @returns {Boolean}
     */
    _canDetectAnimations() {
        return (
            animations.isGetAnimationsSupported() ||
            animations.isTransitionStartSupported()
        );
    }

    /**
     * "Transitionstart" event handler. Will start a single update cycle
     * with a timeout value that is equal to transitions' duration.
     *
     * @private
     * @param {TransitionEvent} event
     */
    _onTransitionStart(event) {
        const duration = animations.computeDuration(event.target);

        this.runUpdates(duration);
    }

    /**
     * "Animationstart" event handler. It starts a repeatable
     * update cycle with a timeout value that is equal to the
     * duration of animation.
     *
     * @private
     * @param {AnimationEvent} event
     */
    _onAnimationStart(event) {
        const duration = animations.computeDuration(event.target, true);

        this.runUpdates(duration, true);
    }

    /**
     * DOM mutations handler.
     *
     * @private
     * @param {Array<MutationRecord>} entries
     */
    _onMutation(entries) {
        // Check if at least one entry
        // contains attributes changes.
        const attrsChanged = entries.some(entry => {
            return entry.type === 'attributes';
        });

        // It's expected that animations will start
        // only after some attribute changes its' value.
        attrsChanged ?
            this._startAnimationCycle() :
            this.runUpdates();
    }
}
