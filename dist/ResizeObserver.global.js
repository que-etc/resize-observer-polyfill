(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ResizeObserver"] = factory();
	else
		root["ResizeObserver"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _ResizeObserver = __webpack_require__(1);

	var _ResizeObserver2 = _interopRequireDefault(_ResizeObserver);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	if (typeof window.ResizeObserver !== 'function') {
	    // ResizeObserver host property is not enumerable
	    // in the native implementation.
	    Object.defineProperty(window, 'ResizeObserver', {
	        value: _ResizeObserver2.default,
	        writable: true,
	        configurable: true
	    });
	}

	// Still export the constructor as for me it seems
	// awkward when a module doesn't export anything.
	exports.default = window.ResizeObserver;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _es6Collections = __webpack_require__(2);

	var _ResizeObserverController = __webpack_require__(3);

	var _ResizeObserverController2 = _interopRequireDefault(_ResizeObserverController);

	var _ResizeObserver2 = __webpack_require__(6);

	var _ResizeObserver3 = _interopRequireDefault(_ResizeObserver2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Controller that will be assigned to all instances of ResizeObserver.
	var controller = new _ResizeObserverController2.default();

	// Registry of the internal observers.
	var observers = new _es6Collections.WeakMap();

	/**
	 * ResizeObservers' "Proxy" class which is meant to hide private
	 * properties and methods from public instances.
	 *
	 * Additionally it implements "idleTimeout" and "continuousUpdates" static property
	 * accessors to give control over the behavior of the ResizeObserverController
	 * instance. Changes made to these properties affect all future and
	 * existing observers.
	 */

	var ResizeObserver = function () {
	    /**
	     * Creates a new instance of ResizeObserver.
	     *
	     * @param {Function} callback - Callback that will
	     *      be invoked when dimensions of one of the
	     *      observed elements have been changed.
	     */
	    function ResizeObserver(callback) {
	        _classCallCheck(this, ResizeObserver);

	        if (!arguments.length) {
	            throw new TypeError('1 argument required, but only 0 present.');
	        }

	        var observer = new _ResizeObserver3.default(callback, controller, this);

	        // Register an internal observer.
	        observers.set(this, observer);
	    }

	    /**
	     * Extracts controllers' idle timeout value.
	     *
	     * @returns {Number}
	     */


	    _createClass(ResizeObserver, null, [{
	        key: 'idleTimeout',
	        get: function get() {
	            return controller.idleTimeout;
	        }

	        /**
	         * Sets up new idle timeout.
	         *
	         * @param {Number} value - New timeout value.
	         */
	        ,
	        set: function set(value) {
	            if (typeof value !== 'number') {
	                throw new TypeError('type of "idleTimeout" value must be number.');
	            }

	            if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) < 0) {
	                throw new TypeError('"idleTimeout" value must be greater than 0.');
	            }

	            controller.idleTimeout = value;
	        }

	        /**
	         * Tells whether continuous updates are enabled.
	         *
	         * @returns {Boolean}
	         */

	    }, {
	        key: 'continuousUpdates',
	        get: function get() {
	            return controller.continuousUpdates;
	        }

	        /**
	         * Enables or disables continuous updates.
	         *
	         * @param {Boolean} value - Whether to enable or disable
	         *      continuous updates.
	         */
	        ,
	        set: function set(value) {
	            if (typeof value !== 'boolean') {
	                throw new TypeError('type of "continuousUpdates" value must be boolean.');
	            }

	            controller.continuousUpdates = value;
	        }
	    }]);

	    return ResizeObserver;
	}();

	// Expose public methods of ResizeObserver.


	['observe', 'unobserve', 'disconnect'].forEach(function (method) {
	    ResizeObserver.prototype[method] = function () {
	        var _observers$get;

	        return (_observers$get = observers.get(this))[method].apply(_observers$get, arguments);
	    };
	});

	exports.default = ResizeObserver;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * A collection of shims that provides minimal
	 * support of WeakMap and Map classes.
	 *
	 * These implementations are not meant to be used outside of
	 * ResizeObserver modules as they cover only a limited range
	 * of use cases.
	 */

	/* eslint-disable require-jsdoc */
	var hasNativeCollections = typeof window.WeakMap === 'function' && typeof window.Map === 'function';

	var WeakMap = function () {
	    if (hasNativeCollections) {
	        return window.WeakMap;
	    }

	    function getIndex(arr, key) {
	        var result = -1;

	        arr.some(function (entry, index) {
	            var matches = entry[0] === key;

	            if (matches) {
	                result = index;
	            }

	            return matches;
	        });

	        return result;
	    }

	    return function () {
	        function _class() {
	            _classCallCheck(this, _class);

	            this.__entries__ = [];
	        }

	        _class.prototype.get = function get(key) {
	            var index = getIndex(this.__entries__, key);

	            return this.__entries__[index][1];
	        };

	        _class.prototype.set = function set(key, value) {
	            var index = getIndex(this.__entries__, key);

	            if (~index) {
	                this.__entries__[index][1] = value;
	            } else {
	                this.__entries__.push([key, value]);
	            }
	        };

	        _class.prototype.delete = function _delete(key) {
	            var entries = this.__entries__,
	                index = getIndex(entries, key);

	            if (~index) {
	                entries.splice(index, 1);
	            }
	        };

	        _class.prototype.has = function has(key) {
	            return !!~getIndex(this.__entries__, key);
	        };

	        return _class;
	    }();
	}();

	var Map = function () {
	    if (hasNativeCollections) {
	        return window.Map;
	    }

	    return function (_WeakMap) {
	        _inherits(_class2, _WeakMap);

	        function _class2() {
	            _classCallCheck(this, _class2);

	            return _possibleConstructorReturn(this, _WeakMap.apply(this, arguments));
	        }

	        _class2.prototype.clear = function clear() {
	            this.__entries__.splice(0, this.__entries__.length);
	        };

	        _class2.prototype.entries = function entries() {
	            return this.__entries__.slice();
	        };

	        _class2.prototype.keys = function keys() {
	            return this.__entries__.map(function (entry) {
	                return entry[0];
	            });
	        };

	        _class2.prototype.values = function values() {
	            return this.__entries__.map(function (entry) {
	                return entry[1];
	            });
	        };

	        _class2.prototype.forEach = function forEach(callback) {
	            var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	            for (var _iterator = this.__entries__, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                var _ref;

	                if (_isArray) {
	                    if (_i >= _iterator.length) break;
	                    _ref = _iterator[_i++];
	                } else {
	                    _i = _iterator.next();
	                    if (_i.done) break;
	                    _ref = _i.value;
	                }

	                var entry = _ref;

	                callback.call(ctx, entry[1], entry[0]);
	            }
	        };

	        _createClass(_class2, [{
	            key: 'size',
	            get: function get() {
	                return this.__entries__.length;
	            }
	        }]);

	        return _class2;
	    }(WeakMap);
	}();

	exports.Map = Map;
	exports.WeakMap = WeakMap;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _performance = __webpack_require__(4);

	var _performance2 = _interopRequireDefault(_performance);

	var _requestAnimationFrame = __webpack_require__(5);

	var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var mutationsSupported = typeof window.MutationObserver === 'function';

	/**
	 * Creates a wrapper function which ensures only one
	 * invocation of provided callback during the specified delay.
	 *
	 * @param {Function} callback - Function to be invoked.
	 * @param {Number} [delay = 0] - Delay after which to invoke callback.
	 * @returns {Function}
	 */
	function debounce(callback) {
	    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	    var timeoutID = false;

	    return function () {
	        var _this = this;

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        if (timeoutID !== false) {
	            clearTimeout(timeoutID);
	        }

	        timeoutID = setTimeout(function () {
	            timeoutID = false;

	            /* eslint-disable no-invalid-this */
	            callback.apply(_this, args);

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

	var ResizeObserverController = function () {
	    /**
	     * Creates a new instance of ResizeObserverController.
	     *
	     * @param {Number} [idleTimeout = 0] - Idle timeout value.
	     * @param {Boolean} [continuousUpdates = false] - Whether to use a continuous update cycle.
	     */
	    function ResizeObserverController() {
	        var idleTimeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
	        var continuousUpdates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	        _classCallCheck(this, ResizeObserverController);

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
	        this._onMutation = this._onMutation.bind(this);
	        this._resolveScheduled = this._resolveScheduled.bind(this);

	        // Function that will be invoked to re-run the
	        // update cycle if continuous cycles are enabled.
	        this._continuousCycleHandler = debounce(this.runUpdates, 100);
	    }

	    /**
	     * Returns current idle timeout value.
	     *
	     * @returns {Number}
	     */


	    /**
	     * Adds observer to observers list.
	     *
	     * @param {ResizeObserver} observer - Observer to be added.
	     */
	    ResizeObserverController.prototype.connect = function connect(observer) {
	        if (!this.isConnected(observer)) {
	            this._observers.push(observer);
	        }

	        // Add listeners if they haven't been added yet.
	        if (!this._listenersEnabled) {
	            this._addListeners();
	        }
	    };

	    /**
	     * Removes observer from observers list.
	     *
	     * @param {ResizeObserver} observer - Observer to be removed.
	     */


	    ResizeObserverController.prototype.disconnect = function disconnect(observer) {
	        var observers = this._observers,
	            index = observers.indexOf(observer);

	        if (~index) {
	            observers.splice(index, 1);
	        }

	        // Remove listeners if controller
	        // has no connected observers.
	        if (!observers.length && this._listenersEnabled) {
	            this._removeListeners();
	        }
	    };

	    /**
	     * Tells whether provided observer is connected to controller.
	     *
	     * @param {ResizeObserver} observer - Observer to be checked.
	     * @returns {Boolean}
	     */


	    ResizeObserverController.prototype.isConnected = function isConnected(observer) {
	        return !!~this._observers.indexOf(observer);
	    };

	    /**
	     * Updates every observer from observers list and
	     * notifies them of queued entries.
	     *
	     * @private
	     * @returns {Boolean} Returns "true" if any observer
	     *      has detected changes in dimensions of its' elements.
	     */


	    ResizeObserverController.prototype._updateObservers = function _updateObservers() {
	        var hasChanges = false;

	        for (var _iterator = this._observers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	            var _ref;

	            if (_isArray) {
	                if (_i >= _iterator.length) break;
	                _ref = _iterator[_i++];
	            } else {
	                _i = _iterator.next();
	                if (_i.done) break;
	                _ref = _i.value;
	            }

	            var observer = _ref;

	            observer.gatherActive();

	            if (observer.hasActive()) {
	                hasChanges = true;

	                observer.broadcastActive();
	            }
	        }

	        return hasChanges;
	    };

	    /**
	     * Starts the update cycle which runs either
	     * until it detects changes in the dimensions of
	     * elements or the idle timeout is reached.
	     */


	    ResizeObserverController.prototype.runUpdates = function runUpdates() {
	        this._cycleStartTime = (0, _performance2.default)();
	        this._isCycleActive = true;

	        this.scheduleUpdate();
	    };

	    /**
	     * Schedules the update of observers.
	     */


	    ResizeObserverController.prototype.scheduleUpdate = function scheduleUpdate() {
	        // Schedule new update if it
	        // hasn't been scheduled already.
	        if (!this._isUpdateScheduled) {
	            this._isUpdateScheduled = true;

	            (0, _requestAnimationFrame2.default)(this._resolveScheduled);
	        }
	    };

	    /**
	     * Invokes the update of observers. It may re-run the
	     * cycle if changes in observers have been detected.
	     *
	     * @private
	     */


	    ResizeObserverController.prototype._resolveScheduled = function _resolveScheduled() {
	        var hasChanges = this._updateObservers();

	        this._isUpdateScheduled = false;

	        // Do nothing if cycle wasn't started,
	        // i.e. a single update was requested.
	        if (!this._isCycleActive) {
	            return;
	        }

	        // Re-start cycle so that we can catch future changes,
	        // e.g. when there are active CSS transitions.
	        if (hasChanges) {
	            this.runUpdates();
	        } else if (this._hasRemainingTime()) {
	            // Keep running updates if idle timeout isn't reached yet.
	            // This way we make it possible to adjust to delayed transitions.
	            this.scheduleUpdate();
	        } else {
	            // Finish update cycle.
	            this._endUpdates();
	        }
	    };

	    /**
	     * Tells whether the update cycle has time remaining.
	     *
	     * @private
	     * @returns {Boolean}
	     */


	    ResizeObserverController.prototype._hasRemainingTime = function _hasRemainingTime() {
	        var timePassed = (0, _performance2.default)() - this._cycleStartTime;

	        return this._idleTimeout - timePassed > 0;
	    };

	    /**
	     * Callback which is invoked when update cycle
	     * is finished. It may start a new cycle if continuous
	     * updates are enabled.
	     *
	     * @private
	     */


	    ResizeObserverController.prototype._endUpdates = function _endUpdates() {
	        this._isCycleActive = false;

	        if (this._isCycleContinuous && this._listenersEnabled) {
	            this._continuousCycleHandler();
	        }
	    };

	    /**
	     * Initializes DOM listeners.
	     *
	     * @private
	     */


	    ResizeObserverController.prototype._addListeners = function _addListeners() {
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

	        // Don't wait for possible event that might trigger the
	        // update of observers and manually initiate update cycle.
	        if (this._isCycleContinuous) {
	            this.runUpdates();
	        }
	    };

	    /**
	     * Removes DOM listeners.
	     *
	     * @private
	     */


	    ResizeObserverController.prototype._removeListeners = function _removeListeners() {
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
	    };

	    /**
	     * DOM mutations handler.
	     *
	     * @private
	     * @param {Array<MutationRecord>} entries - An array of mutation records.
	     */


	    ResizeObserverController.prototype._onMutation = function _onMutation(entries) {
	        // Check if at least one entry
	        // contains attributes changes.
	        var attrsChanged = entries.some(function (entry) {
	            return entry.type === 'attributes';
	        });

	        // It's expected that animations may start only
	        // after some attribute changes its' value.
	        attrsChanged ? this.runUpdates() : this.scheduleUpdate();
	    };

	    _createClass(ResizeObserverController, [{
	        key: 'idleTimeout',
	        get: function get() {
	            return this._idleTimeout;
	        }

	        /**
	         * Sets up new idle timeout value.
	         *
	         * @param {Number} value - New timeout value.
	         */
	        ,
	        set: function set(value) {
	            this._idleTimeout = value;
	        }

	        /**
	         * Tells whether continuous updates are enabled.
	         *
	         * @returns {Boolean}
	         */

	    }, {
	        key: 'continuousUpdates',
	        get: function get() {
	            return this._isCycleContinuous;
	        }

	        /**
	         * Enables or disables continuous updates.
	         *
	         * @param {Boolean} enable - Whether to enable or disable
	         *      continuous updates. Note that the value won't be applied
	         *      if MutationObserver is not supported.
	         */
	        ,
	        set: function set(enable) {
	            // The state of continuous updates should not be modified
	            // if MutationObserver is not supported.
	            if (!mutationsSupported) {
	                return;
	            }

	            this._isCycleContinuous = enable;

	            // Immediately start the update cycle in order not to
	            // wait for a possible event that will initiate it.
	            if (this._listenersEnabled && enable) {
	                this.runUpdates();
	            }
	        }
	    }]);

	    return ResizeObserverController;
	}();

	exports.default = ResizeObserverController;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	/**
	 * A shim for performance.now method which falls back
	 * to Date.now if the first one is not supported.
	 *
	 * @returns {Timestamp}
	 */
	exports.default = function () {
	    if (window.performance && typeof window.performance.now === 'function') {
	        return function () {
	            return window.performance.now();
	        };
	    }

	    return function () {
	        return Date.now();
	    };
	}();

	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	/**
	 * A shim for requestAnimationFrame which falls back
	 * to setTimeout if the first one is not supported.
	 *
	 * @returns {Number} Requests' identifier.
	 */
	exports.default = function () {
	    if (window.requestAnimationFrame && typeof window.requestAnimationFrame === 'function') {
	        return window.requestAnimationFrame;
	    }

	    return function (callback) {
	        return setTimeout(function () {
	            return callback(Date.now());
	        }, 1000 / 60);
	    };
	}();

	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _es6Collections = __webpack_require__(2);

	var _ResizeObservation = __webpack_require__(7);

	var _ResizeObservation2 = _interopRequireDefault(_ResizeObservation);

	var _ResizeObserverEntry = __webpack_require__(8);

	var _ResizeObserverEntry2 = _interopRequireDefault(_ResizeObserverEntry);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ResizeObserver = function () {
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
	    function ResizeObserver(callback, controller, publicObserver) {
	        _classCallCheck(this, ResizeObserver);

	        if (typeof callback !== 'function') {
	            throw new TypeError('The callback provided as parameter 1 is not a function.');
	        }

	        // Reference to the callback function.
	        this._callback = callback;

	        // Registry of ResizeObservation instances.
	        this._targets = new _es6Collections.Map();

	        // Collection of resize observations that have detected
	        // changes in dimensions of elements.
	        this._activeTargets = [];

	        // Reference to the associated ResizeObserverController.
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


	    ResizeObserver.prototype.observe = function observe(target) {
	        //  Throw the same errors as in a native implementation.
	        if (!arguments.length) {
	            throw new TypeError('1 argument required, but only 0 present.');
	        }

	        if (!(target instanceof Element)) {
	            throw new TypeError('parameter 1 is not of type "Element".');
	        }

	        var targets = this._targets;

	        // Do nothing if element is already being observed.
	        if (targets.has(target)) {
	            return;
	        }

	        targets.set(target, new _ResizeObservation2.default(target));

	        // Add observer to controller if
	        // it hasn't been connected yet.
	        if (!this._controller.isConnected(this)) {
	            this._controller.connect(this);
	        }

	        // Update observations.
	        this._controller.runUpdates();
	    };

	    /**
	     * Stops observing provided element.
	     *
	     * @param {Element} target - Element to stop observing.
	     */


	    ResizeObserver.prototype.unobserve = function unobserve(target) {
	        //  Throw the same errors as in a native implementation.
	        if (!arguments.length) {
	            throw new TypeError('1 argument required, but only 0 present.');
	        }

	        if (!(target instanceof Element)) {
	            throw new TypeError('parameter 1 is not of type "Element".');
	        }

	        var targets = this._targets;

	        // Do nothing if element is not being observed.
	        if (!targets.has(target)) {
	            return;
	        }

	        // Remove element and associated with
	        // it ResizeObsrvation instance from registry.
	        targets.delete(target);

	        // Set back the initial state if
	        // there is nothing to observe.
	        if (!targets.size) {
	            this.disconnect();
	        }
	    };

	    /**
	     * Stops observing all elements and
	     * clears the observations list.
	     */


	    ResizeObserver.prototype.disconnect = function disconnect() {
	        this.clearActive();
	        this._targets.clear();
	        this._controller.disconnect(this);
	    };

	    /**
	     * Invokes initial callback function with a list
	     * of ResizeObserverEntry instances collected from
	     * active resize observations.
	     */


	    ResizeObserver.prototype.broadcastActive = function broadcastActive() {
	        // Do nothing if observer doesn't
	        // have active observations.
	        if (!this.hasActive()) {
	            return;
	        }

	        var publicObserver = this._publicObserver;

	        // Create ResizeObserverEntry instance
	        // for every active observation.
	        var entries = this._activeTargets.map(function (observation) {
	            return new _ResizeObserverEntry2.default(observation.target, observation.broadcastRect());
	        });

	        this.clearActive();

	        this._callback.call(publicObserver, entries, publicObserver);
	    };

	    /**
	     * Clears the collection of pending/active observations.
	     */


	    ResizeObserver.prototype.clearActive = function clearActive() {
	        this._activeTargets.splice(0);
	    };

	    /**
	     * Tells whether the observer has
	     * pending observations.
	     *
	     * @returns {Boolean}
	     */


	    ResizeObserver.prototype.hasActive = function hasActive() {
	        return !!this._activeTargets.length;
	    };

	    /**
	     * Clears an array of previously collected active observations
	     * and collects observation instances which associated element
	     * has changed its' content rectangle.
	     */


	    ResizeObserver.prototype.gatherActive = function gatherActive() {
	        this.clearActive();

	        var activeTargets = this._activeTargets;

	        this._targets.forEach(function (observation) {
	            if (observation.isActive()) {
	                activeTargets.push(observation);
	            }
	        });
	    };

	    return ResizeObserver;
	}();

	exports.default = ResizeObserver;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Placeholder of an empty content rectangle.
	var emptyRect = createContentRect(0, 0, 0, 0);

	/**
	 * Extracts computed styles of provided element.
	 *
	 * @param {Element} target
	 * @returns {CSSStyleDeclaration}
	 */
	function getStyles(target) {
	    return window.getComputedStyle(target);
	}

	/**
	 * Converts provided string defined
	 * in q form of '{{value}}px' to number.
	 *
	 * @param {String} value
	 * @returns {Number}
	 */
	function pixelsToNumber(value) {
	    return parseFloat(value) || 0;
	}

	/**
	 * Extracts borders size from provided styles.
	 *
	 * @param {CSSStyleDeclaration} styles
	 * @param {...String} positions - Borders positions (top, right, ...)
	 * @returns {Number}
	 */
	function getBordersSize(styles) {
	    for (var _len = arguments.length, positions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        positions[_key - 1] = arguments[_key];
	    }

	    return positions.reduce(function (size, pos) {
	        var value = styles['border-' + pos + '-width'];

	        return size + pixelsToNumber(value);
	    }, 0);
	}

	/**
	 *  Extracts paddings sizes from provided styles.
	 *
	 * @param {CSSStyleDeclaration} styles
	 * @returns {Object} Paddings box.
	 */
	function getPaddings(styles) {
	    var boxKeys = ['top', 'right', 'bottom', 'left'];
	    var paddings = {};

	    for (var _iterator = boxKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	        var _ref;

	        if (_isArray) {
	            if (_i >= _iterator.length) break;
	            _ref = _iterator[_i++];
	        } else {
	            _i = _iterator.next();
	            if (_i.done) break;
	            _ref = _i.value;
	        }

	        var key = _ref;

	        var value = styles['padding-' + key];

	        paddings[key] = pixelsToNumber(value);
	    }

	    return paddings;
	}

	/**
	 * Creates content rectangle based on the provided dimensions
	 * and the top/left positions.
	 *
	 * @param {Number} width - Width of rectangle.
	 * @param {Number} height - Height of rectangle.
	 * @param {Number} top - Top position.
	 * @param {Number} left - Left position.
	 * @returns {ClientRect}
	 */
	function createContentRect(width, height, top, left) {
	    return {
	        width: width, height: height, top: top,
	        right: width + left,
	        bottom: height + top,
	        left: left
	    };
	}

	/**
	 * Calculates content rectangle of provided SVG element.
	 *
	 * @param {SVGElement} target - Element whose content
	 *      rectangle needs to be calculated.
	 * @returns {ClientRect}
	 */
	function getSVGContentRect(target) {
	    var bbox = target.getBBox();

	    return createContentRect(bbox.width, bbox.height, 0, 0);
	}

	/**
	 * Calculates content rectangle of a root element.
	 *
	 * @returns {ClientRect}
	 */
	function getDocElementRect() {
	    // Neither scroll[Width/Height] nor offset[Width/Height] can be used to define
	    // content dimensions as they give inconsistent results across different browsers.
	    // E.g. in the Internet Explorer 10 and lower value of these properties can't be
	    // less than the client dimensions (same thing with the "getBoundingClientRect" method).
	    // And Firefox has the same behavior with its "scroll" properties.
	    var styles = getStyles(document.documentElement);

	    var width = pixelsToNumber(styles.width);
	    var height = pixelsToNumber(styles.height);

	    return createContentRect(width, height, 0, 0);
	}

	/**
	 * Calculates content rectangle of provided HTMLElement.
	 *
	 * @param {HTMLElement} target - Element whose content
	 *      rectangle needs to be calculated.
	 * @returns {ClientRect}
	 */
	function getHTMLElementContentRect(target) {
	    // Client width & height properties can't be
	    // used exclusively as they provide rounded values.
	    var clientWidth = target.clientWidth;
	    var clientHeight = target.clientHeight;

	    // By this condition we can catch all non-replaced inline, hidden and detached
	    // elements. Though elements with width & height properties less than 0.5 will
	    // be discarded as well.
	    //
	    // Without it we would need to implement separate methods for each of
	    // those cases and it's not possible to perform a precise and performance
	    // effective test for hidden elements. E.g. even jQuerys' ':visible' filter
	    // gives wrong results for elements with width & height less than 0.5.
	    if (!clientWidth && !clientHeight) {
	        return emptyRect;
	    }

	    var styles = getStyles(target);
	    var paddings = getPaddings(styles);
	    var horizPad = paddings.left + paddings.right;
	    var vertPad = paddings.top + paddings.bottom;

	    // Computed styles of width & height are being used because they are the
	    // only dimensions available to JS that contain non-rounded values. It could
	    // be possible to utilize getBoundingClientRect if only its' data wasn't
	    // affected by CSS transformations let alone paddings, borders and scroll bars.
	    var width = pixelsToNumber(styles.width),
	        height = pixelsToNumber(styles.height);

	    // Width & height include paddings and borders
	    // when 'border-box' box model is applied (except for IE).
	    if (styles.boxSizing === 'border-box') {
	        // Following conditions are required to handle Internet Explorer which
	        // doesn't include paddings and borders to computed CSS dimensions.
	        //
	        // We can say that if CSS dimensions + paddings are equal to the "client" properties
	        // then it's either IE, and thus we don't need to subtract anything, or
	        // an element merely doesn't have paddings/borders styles.
	        if (Math.round(width + horizPad) !== clientWidth) {
	            width -= getBordersSize(styles, 'left', 'right') + horizPad;
	        }

	        if (Math.round(height + vertPad) !== clientHeight) {
	            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
	        }
	    }

	    // In some browsers (only in Firefox, actually) CSS width & height
	    // include scroll bars size which can be removed at this step as scroll bars
	    // are the only difference between rounded dimensions + paddings
	    // and "client" properties, though that is not always true in Chrome.
	    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
	    var horizScrollbar = Math.round(height + vertPad) - clientHeight;

	    // Chrome has a rather weird rounding of "client" properties.
	    // E.g. for an element whose content width is 314.2px it sometimes
	    // gives the client width of 315px and for the width of 314.7px
	    // it may give 314px. And it doesn't happen all the time.
	    // This kind of difference needs to be ignored.
	    if (Math.abs(vertScrollbar) !== 1) {
	        width -= vertScrollbar;
	    }

	    if (Math.abs(horizScrollbar) !== 1) {
	        height -= horizScrollbar;
	    }

	    return createContentRect(width, height, paddings.top, paddings.left);
	}

	/**
	 * Checks whether provided element
	 * is an instance of SVGElement.
	 *
	 * @param {Element} target - Element to be checked.
	 * @returns {Boolean}
	 */
	function isSVGElement(target) {
	    return target instanceof window.SVGElement;
	}

	/**
	 * Checks whether provided element is
	 * a document element (root element of a document).
	 *
	 * @param {Element} target - Element to be checked.
	 * @returns {Boolean}
	 */
	function isDocumentElement(target) {
	    return target === document.documentElement;
	}

	/**
	 * Calculates an appropriate content rectangle
	 * for provided html or svg element.
	 *
	 * @param {Element} target - Element whose content rectangle
	 *      needs to be calculated.
	 * @returns {ClientRect}
	 */
	function getContentRect(target) {
	    if (isSVGElement(target)) {
	        return getSVGContentRect(target);
	    }

	    if (isDocumentElement(target)) {
	        return getDocElementRect();
	    }

	    return getHTMLElementContentRect(target);
	}

	/**
	 * Class that is responsible for computations of the
	 * content rectangle of provided DOM element and
	 * for keeping track of its' changes.
	 */

	var ResizeObservation = function () {
	    /**
	     * Creates an instance of ResizeObservation.
	     *
	     * @param {Element} target - Element whose content
	     *      rectangle needs to be observed.
	     */
	    function ResizeObservation(target) {
	        _classCallCheck(this, ResizeObservation);

	        this.target = target;

	        // Keeps reference to the last observed content rectangle.
	        this._contentRect = emptyRect;

	        // Broadcasted width of content rectangle.
	        this.broadcastWidth = 0;

	        // Broadcasted height of content rectangle.
	        this.broadcastHeight = 0;
	    }

	    /**
	     * Updates 'broadcastWidth' and 'broadcastHeight'
	     * properties with a data from the corresponding
	     * properties of the last observed content rectangle.
	     *
	     * @returns {ClientRect} Last observed content rectangle.
	     */


	    ResizeObservation.prototype.broadcastRect = function broadcastRect() {
	        var rect = this._contentRect;

	        this.broadcastWidth = rect.width;
	        this.broadcastHeight = rect.height;

	        return rect;
	    };

	    /**
	     * Updates content rectangle and tells whether its'
	     * width or height properties have changed since
	     * the last broadcast.
	     *
	     * @returns {Boolean}
	     */


	    ResizeObservation.prototype.isActive = function isActive() {
	        var rect = getContentRect(this.target);

	        this._contentRect = rect;

	        return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
	    };

	    return ResizeObservation;
	}();

	exports.default = ResizeObservation;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ResizeObserverEntry =
	/**
	 * Creates an instance of ResizeObserverEntry.
	 *
	 * @param {Element} target - Element that is being observed.
	 * @param {ClientRect} rectData - Data of the elements' content rectangle.
	 */
	function ResizeObserverEntry(target, rectData) {
	    _classCallCheck(this, ResizeObserverEntry);

	    // Content rectangle needs to be an instance
	    // of ClientRect if it's available.
	    var rectInterface = window.ClientRect ? ClientRect.prototype : Object.prototype;

	    // According to the specification following properties
	    // are not writable and are also not enumerable in the
	    // native implementation
	    var contentRect = Object.create(rectInterface, {
	        width: { value: rectData.width },
	        height: { value: rectData.height },
	        top: { value: rectData.top },
	        right: { value: rectData.right },
	        bottom: { value: rectData.bottom },
	        left: { value: rectData.left }
	    });

	    Object.defineProperties(this, {
	        target: { value: target },
	        contentRect: { value: contentRect }
	    });
	};

	exports.default = ResizeObserverEntry;
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;