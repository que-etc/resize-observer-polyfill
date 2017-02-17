/**
 * Exports global object for the current environment.
 */
var global$1 = (function () {
    if (typeof global != 'undefined' && global.Math === Math) {
        return global;
    }

    if (typeof self != 'undefined' && self.Math === Math) {
        return self;
    }

    if (typeof window != 'undefined' && window.Math === Math) {
        return window;
    }

    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc */
var Map = (function () {
    if (typeof global$1.Map === 'function') {
        return global$1.Map;
    }

    function getIndex(arr, key) {
        var result = -1;

        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;

                return true;
            }

            return false;
        });

        return result;
    }

    return (function () {
        function anonymous() {
            this.__entries__ = [];
        }

        var prototypeAccessors = { size: {} };

        prototypeAccessors.size.get = function () {
            return this.__entries__.length;
        };

        anonymous.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];

            return entry && entry[1];
        };

        anonymous.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);

            if (~index) {
                this.__entries__[index][1] = value;
            } else {
                this.__entries__.push([key, value]);
            }
        };

        anonymous.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);

            if (~index) {
                entries.splice(index, 1);
            }
        };

        anonymous.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };

        anonymous.prototype.clear = function () {
            this.__entries__.splice(0);
        };

        anonymous.prototype.forEach = function (callback, ctx) {
            var this$1 = this;
            if ( ctx === void 0 ) ctx = null;

            for (var i = 0, list = this$1.__entries__; i < list.length; i += 1) {
                var entry = list[i];

                callback.call(ctx, entry[1], entry[0]);
            }
        };

        Object.defineProperties( anonymous.prototype, prototypeAccessors );

        return anonymous;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = global$1.window === global$1 && typeof document != 'undefined';

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        return requestAnimationFrame;
    }

    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;

/**
 * Returns time stamp retrieved either from the "performance.now" or from
 * the "Date.now" method.
 *
 * @returns {DOMHighResTimeStamp|number}
 */
var timeStamp = (function () {
    var host = Date;

    if (typeof performance === 'object' && typeof performance.now === 'function') {
        host = performance;
    }

    return function () { return host.now(); };
})();

/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period. It also caches the last
 * call and re-invokes it after pending activation is resolved.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @param {boolean} [afterRAF = false] - Whether function needs to be invoked as
 *      a requestAnimationFrame callback.
 * @returns {Function}
 */
var throttle = function (callback, delay, afterRAF) {
    if ( afterRAF === void 0 ) afterRAF = false;

    var leadingCall = false,
        trailingCall = false,
        lastCallTime = 0;

    /**
     * Invokes the original callback function and schedules a new invocation if
     * the wrapper was called during current request.
     *
     * @returns {void}
     */
    function invokeCallback() {
        leadingCall = false;

        // Invoke original function.
        callback();

        // Schedule new invocation if there has been a call during delay period.
        if (trailingCall) {
            proxy();
        }
    }

    /**
     * Callback that will be invoked after the specified delay period. It will
     * delegate invocation of the original function to the requestAnimationFrame
     * if "afterRAF" parameter is set to "true".
     *
     * @returns {void}
     */
    function timeoutCallback() {
        afterRAF ? requestAnimationFrame$1(invokeCallback) : invokeCallback();
    }

    /**
     * Schedules invocation of the initial function.
     *
     * @returns {void}
     */
    function proxy() {
        var callTime = timeStamp();

        // Postpone activation if there is already a pending call.
        if (leadingCall) {
            // Reject immediately following invocations.
            if (callTime - lastCallTime < trailingTimeout) {
                return;
            }

            trailingCall = true;
        } else {
            leadingCall = true;
            trailingCall = false;

            // Schedule new invocation.
            setTimeout(timeoutCallback, delay);
        }

        lastCallTime = callTime;
    }

    return proxy;
};

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;

// Delay before the next iteration of the continuous cycle.
var CONTINUOUS_DELAY = 80;

// Define whether the MutationObserver is supported.
// eslint-disable-next-line no-extra-parens
var mutationsSupported = typeof MutationObserver === 'function' &&
// MutationObserver should not be used if running in IE11 as it's
// implementation is unreliable. Example: https://jsfiddle.net/x2r3jpuz/2/
// Unfortunately, there is no other way to check this issue but to use
// userAgent's information.
typeof navigator === 'object' && !(navigator.appName === 'Netscape' && navigator.userAgent.match(/Trident\/.*rv:11/));

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
var ResizeObserverController = function() {
    /**
     * Continuous updates must be enabled if MutationObserver is not supported.
     *
     * @private {boolean}
     */
    this.isCycleContinuous_ = !mutationsSupported;

    /**
     * Indicates whether DOM listeners have been added.
     *
     * @private {boolean}
     */
    this.listenersEnabled_ = false;

    /**
     * Keeps reference to the instance of MutationObserver.
     *
     * @private {MutationObserver}
     */
    this.mutationsObserver_ = null;

    /**
     * A list of connected observers.
     *
     * @private {Array<ResizeObserverSPI>}
     */
    this.observers_ = [];

    // Make sure that the "refresh" method is invoked as a RAF callback and
    // that it happens only once during the provided period.
    this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY, true);

    // Additionally postpone invocation of the continuous updates.
    this.continuousUpdateHandler_ = throttle(this.refresh, CONTINUOUS_DELAY);
};

/**
 * Adds observer to observers list.
 *
 * @param {ResizeObserverSPI} observer - Observer to be added.
 * @returns {void}
 */
ResizeObserverController.prototype.connect = function (observer) {
    if (!this.isConnected(observer)) {
        this.observers_.push(observer);
    }

    // Add listeners if they haven't been added yet.
    if (!this.listenersEnabled_) {
        this.addListeners_();
    }
};

/**
 * Removes observer from observers list.
 *
 * @param {ResizeObserverSPI} observer - Observer to be removed.
 * @returns {void}
 */
ResizeObserverController.prototype.disconnect = function (observer) {
    var observers = this.observers_;
    var index = observers.indexOf(observer);

    // Remove observer if it's present in registry.
    if (~index) {
        observers.splice(index, 1);
    }

    // Remove listeners if controller has no connected observers.
    if (!observers.length && this.listenersEnabled_) {
        this.removeListeners_();
    }
};

/**
 * Tells whether the provided observer is connected to controller.
 *
 * @param {ResizeObserverSPI} observer - Observer to be checked.
 * @returns {boolean}
 */
ResizeObserverController.prototype.isConnected = function (observer) {
    return !!~this.observers_.indexOf(observer);
};

/**
 * Invokes the update of observers. It will continue running updates insofar
 * it detects changes or if continuous updates are enabled.
 *
 * @returns {void}
 */
ResizeObserverController.prototype.refresh = function () {
    var hasChanges = this.updateObservers_();

    // Continue running updates if changes have been detected as there might
    // be future ones caused by CSS transitions.
    if (hasChanges) {
        this.refresh();
    } else if (this.isCycleContinuous_ && this.listenersEnabled_) {
        // Automatically repeat cycle if it's necessary.
        this.continuousUpdateHandler_();
    }
};

/**
 * Updates every observer from observers list and notifies them of queued
 * entries.
 *
 * @private
 * @returns {boolean} Returns "true" if any observer has detected changes in
 *  dimensions of it's elements.
 */
ResizeObserverController.prototype.updateObservers_ = function () {
    // Collect observers that have active entries.
    var active = this.observers_.filter(function (observer) {
        return observer.gatherActive(), observer.hasActive();
    });

    // Deliver notifications in a separate cycle in order to avoid any
    // collisions between observers. E.g. when multiple instances of
    // ResizeObserer are tracking the same element and the callback of one
    // of them changes content dimensions of the observed target. Sometimes
    // this may result in notifications being blocked for the rest of observers.
    active.forEach(function (observer) { return observer.broadcastActive(); });

    return active.length > 0;
};

/**
 * Initializes DOM listeners.
 *
 * @private
 * @returns {void}
 */
ResizeObserverController.prototype.addListeners_ = function () {
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
};

/**
 * Removes DOM listeners.
 *
 * @private
 * @returns {void}
 */
ResizeObserverController.prototype.removeListeners_ = function () {
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
};

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var i = 0, list = Object.keys(props); i < list.length; i += 1) {
        var key = list[i];

        Object.defineProperty(target, key, {
            value: props[key],
            enumerbale: false,
            writable: false,
            configurable: true
        });
    }

    return target;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);

/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}

/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = Array.prototype.slice.call(arguments, 1);

    return positions.reduce(function (size, pos) {
        var value = styles['border-' + pos + '-width'];

        return size + toFloat(value);
    }, 0);
}

/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var boxKeys = ['top', 'right', 'bottom', 'left'];
    var paddings = {};

    for (var i = 0, list = boxKeys; i < list.length; i += 1) {
        var key = list[i];

        var value = styles['padding-' + key];

        paddings[key] = toFloat(value);
    }

    return paddings;
}

/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();

    return createRectInit(0, 0, bbox.width, bbox.height);
}

/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth;
    var clientHeight = target.clientHeight;

    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }

    var styles = getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;

    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width),
        height = toFloat(styles.height);

    // Width & height include paddings and bord when 'border-box' box model is
    // applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }

        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }

    // Following steps can't applied to the document's root element as it's
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;

        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }

        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }

    return createRectInit(paddings.left, paddings.top, width, height);
}

/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement === 'function') {
        return function (target) { return target instanceof SVGGraphicsElement; };
    }

    // If it's so, than check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method in the prototype chain.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return target instanceof SVGElement && typeof target.getBBox === 'function'; };
})();

/**
 * Checks whether provided element is a document element (root element of a document, i.e. <html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === document.documentElement;
}

/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    // Return empty rectangle if running in a non-browser environment.
    if (!isBrowser) {
        return emptyRect;
    }

    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }

    return getHTMLElementContentRect(target);
}

/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(ref) {
    var x = ref.x;
    var y = ref.y;
    var width = ref.width;
    var height = ref.height;

    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly === 'function' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);

    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y,
        width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });

    return rect;
}

/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = function(target) {
    /**
     * Reference to the observed element.
     *
     * @type {Element}
     */
    this.target = target;

    /**
     * Broadcasted width of content rectangle.
     *
     * @type {number}
     */
    this.broadcastWidth = 0;

    /**
     * Broadcasted height of content rectangle.
     *
     * @type {number}
     */
    this.broadcastHeight = 0;

    /**
     * Reference to the last observed content rectangle.
     *
     * @private {DOMRectInit}
     */
    this.contentRect_ = createRectInit(0, 0, 0, 0);
};

/**
 * Updates content rectangle and tells whether it's width or height properties
 * have changed since the last broadcast.
 *
 * @returns {boolean}
 */
ResizeObservation.prototype.isActive = function () {
    var rect = getContentRect(this.target);

    this.contentRect_ = rect;

    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
};

/**
 * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
 * from the corresponding properties of the last observed content rectangle.
 *
 * @returns {DOMRectInit} Last observed content rectangle.
 */
ResizeObservation.prototype.broadcastRect = function () {
    var rect = this.contentRect_;

    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;

    return rect;
};

var ResizeObserverEntry = function(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);

    // According to the specification following properties are not writable
    // and are also not enumerable in the native implementation.
    //
    // Property accessors are not being used as they'd require to define a
    // private WeakMap storage which may cause memory leaks in browsers that
    // don't support this type of collections.
    defineConfigurable(this, { target: target, contentRect: contentRect });
};

var ResizeObserverSPI = function(callback, controller, callbackCtx) {
    if (typeof callback !== 'function') {
        throw new TypeError('The callback provided as parameter 1 is not a function.');
    }

    /**
     * Collection of resize observations that have detected changes in dimensions
     * of elements.
     *
     * Spec: https://wicg.github.io/ResizeObserver/#dom-resizeobserver-activetargets
     *
     * @private {Array<ResizeObservation>}
     */
    this.activeTargets_ = [];

    /**
     * Registry of the ResizeObservation instances.
     * Spec: https://wicg.github.io/ResizeObserver/#dom-resizeobserver-observationtargets
     *
     * @private {Map<Element, ResizeObservation>}
     */
    this.observationTargets_ = new Map();

    /**
     * Reference to the callback function.
     * Spec: https://wicg.github.io/ResizeObserver/#resize-observer-callback
     *
     * @private {ResizeObserverCallback}
     */
    this.callback_ = callback;

    /**
     * Reference to the associated ResizeObserverController.
     *
     * @private {ResizeObserverController}
     */
    this.controller_ = controller;

    /**
     * Public ResizeObserver instance which will be passed to the callback
     * function and used as a value of it's "this" binding.
     *
     * @private {ResizeObserver}
     */
    this.callbackCtx_ = callbackCtx;
};

/**
 * Starts observing provided element.
 * Spec: https://wicg.github.io/ResizeObserver/#dom-resizeobserver-observe
 *
 * @param {Element} target - Element to be observed.
 * @returns {void}
 */
ResizeObserverSPI.prototype.observe = function (target) {
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Do nothing if current environment doesn't have the Element interface.
    if (!('Element' in global$1) || !(Element instanceof Object)) {
        return;
    }

    if (!(target instanceof Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
    }

    var targets = this.observationTargets_;

    // Do nothing if element is already being observed.
    if (targets.has(target)) {
        return;
    }

    // Register new ResizeObservation instance.
    targets.set(target, new ResizeObservation(target));

    // Add observer to controller if it hasn't been connected yet.
    if (!this.controller_.isConnected(this)) {
        this.controller_.connect(this);
    }

    // Force the update of observations.
    this.controller_.refresh();
};

/**
 * Stops observing provided element.
 * Spec: https://wicg.github.io/ResizeObserver/#dom-resizeobserver-unobserve
 *
 * @param {Element} target - Element to stop observing.
 * @returns {void}
 */
ResizeObserverSPI.prototype.unobserve = function (target) {
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Do nothing if current environment doesn't have the Element interface.
    if (!('Element' in global$1) || !(Element instanceof Object)) {
        return;
    }

    if (!(target instanceof Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
    }

    var targets = this.observationTargets_;

    // Do nothing if element is not being observed.
    if (!targets.has(target)) {
        return;
    }

    // Remove element and associated with it ResizeObsrvation instance from
    // registry.
    targets.delete(target);

    // Set back the initial state if there is nothing to observe.
    if (!targets.size) {
        this.controller_.disconnect(this);
    }
};

/**
 * Stops observing all elements and clears the observations list.
 * Spec: https://wicg.github.io/ResizeObserver/#dom-resizeobserver-disconnect
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.disconnect = function () {
    this.clearActive();
    this.observationTargets_.clear();
    this.controller_.disconnect(this);
};

/**
 * Clears an array of previously collected active observations and collects
 * observation instances which associated element has changed it's content
 * rectangle.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.gatherActive = function () {
    this.clearActive();

    var activeTargets = this.activeTargets_;

    this.observationTargets_.forEach(function (observation) {
        if (observation.isActive()) {
            activeTargets.push(observation);
        }
    });
};

/**
 * Invokes initial callback function with a list of ResizeObserverEntry
 * instances collected from active resize observations.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.broadcastActive = function () {
    // Do nothing if observer doesn't have active observations.
    if (!this.hasActive()) {
        return;
    }

    var ctx = this.callbackCtx_;

    // Create ResizeObserverEntry instance for every active observation.
    var entries = this.activeTargets_.map(function (observation) {
        return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });

    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
};

/**
 * Clears the collection of pending/active observations.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.clearActive = function () {
    this.activeTargets_.splice(0);
};

/**
 * Tells whether observer has pending observations.
 *
 * @returns {boolean}
 */
ResizeObserverSPI.prototype.hasActive = function () {
    return this.activeTargets_.length > 0;
};

// Controller that will be assigned to all instances of the ResizeObserver.
var controller = new ResizeObserverController();

// Registry of internal observers. If WeakMap is not available use current shim
// of the Map collection as the former one can't be polyfilled anyway.
var observers = typeof WeakMap === 'function' ? new WeakMap() : new Map();

/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * providing only those methods properties that are define in the spec.
 */
var ResizeObserver = function(callback) {
    if (!(this instanceof ResizeObserver)) {
        throw new TypeError('Cannot call a class as a function');
    }

    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Create a new instance of an internal ResizeObserver.
    var observer = new ResizeObserverSPI(callback, controller, this);

    // Register internal observer.
    observers.set(this, observer);
};

// Expose public methods of ResizeObserver.
['observe', 'unobserve', 'disconnect'].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        var ref;

        return (ref = observers.get(this))[method].apply(ref, arguments);
    };
});

var index = (function () {
    // Export existing implementation if it's available.
    if (typeof global$1.ResizeObserver === 'function') {
        return global$1.ResizeObserver;
    }

    return ResizeObserver;
})();

export default index;
