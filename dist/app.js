(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ResizeObserver = __webpack_require__(1);
	
	var _ResizeObserver2 = _interopRequireDefault(_ResizeObserver);
	
	var _randomcolor = __webpack_require__(9);
	
	var _randomcolor2 = _interopRequireDefault(_randomcolor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// We need to use a polyfill itself here,
	// not its' possible native implementation.
	var hues = ['red', 'pink', 'blue', 'orange', 'purple', 'monochrome'];
	
	var colorData = {
	    luminosity: 'light',
	    hue: hues[getRandomInt(0, 5)]
	};
	
	var observer = new _ResizeObserver2.default(function (entries) {
	    for (var _iterator = entries, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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
	
	        var rect = entry.contentRect;
	        var dimensionsStr = rect.width.toFixed(2) + ' x ' + rect.height.toFixed(2);
	
	        entry.target.firstElementChild.textContent = dimensionsStr;
	    }
	});
	
	var index = 0;
	var queue = [];
	
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function updateColorData() {
	    colorData.hue = hues[getRandomInt(0, 5)];
	}
	
	function generateColor() {
	    return (0, _randomcolor2.default)(colorData);
	}
	
	function toArray(collection) {
	    return Array.prototype.slice.call(collection);
	}
	
	function generateElements(container, levels) {
	    var items = arguments.length <= 2 || arguments[2] === undefined ? 4 : arguments[2];
	
	    var index = items;
	
	    levels--;
	
	    while (index--) {
	        var className = 'block';
	        var block = document.createElement('div');
	
	        if (levels) {
	            className += ' parent';
	
	            generateElements(block, levels, items);
	        } else {
	            className += ' leaf';
	
	            block.innerHTML = '<span class="dimen"></span>';
	            block.style.backgroundColor = generateColor();
	        }
	
	        block.className = className;
	
	        container.appendChild(block);
	    }
	}
	
	generateElements(document.getElementById('container'), 2);
	
	function populateQueue() {
	    index = 0;
	    queue = toArray(document.querySelectorAll('.block'));
	
	    updateColorData();
	
	    requestAnimationFrame(resolveNextItem);
	}
	
	function resolveNextItem() {
	    var block = queue.shift();
	
	    if (!block) {
	        setTimeout(populateQueue, 2500);
	
	        return;
	    }
	
	    if (!index || index === 2) {
	        block.style.maxWidth = getRandomInt(30, 50) + '%';
	
	        if (index === 2) {
	            block.style.minHeight = getRandomInt(0, 80) + '%';
	        }
	    }
	
	    if (~block.className.indexOf('leaf')) {
	        block.style.backgroundColor = generateColor();
	    }
	
	    if (++index === 4) {
	        index = 0;
	    }
	
	    requestAnimationFrame(resolveNextItem);
	}
	
	for (var _iterator2 = toArray(document.querySelectorAll('.leaf')), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	    var _ref2;
	
	    if (_isArray2) {
	        if (_i2 >= _iterator2.length) break;
	        _ref2 = _iterator2[_i2++];
	    } else {
	        _i2 = _iterator2.next();
	        if (_i2.done) break;
	        _ref2 = _i2.value;
	    }
	
	    var leaf = _ref2;
	
	    observer.observe(leaf);
	}
	
	setTimeout(populateQueue, 2000);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _es6Collections = __webpack_require__(2);
	
	var _ResizeObserverController = __webpack_require__(3);
	
	var _ResizeObserverController2 = _interopRequireDefault(_ResizeObserverController);
	
	var _ResizeObserver2 = __webpack_require__(6);
	
	var _ResizeObserver3 = _interopRequireDefault(_ResizeObserver2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// Controller which will be assigned to all instances of ResizeObserver.
	var controller = new _ResizeObserverController2.default();
	
	// Registry of internal observers.
	var observers = new _es6Collections.WeakMap();
	
	/**
	 * ResizeObservers' "Proxy" class which is meant to hide private
	 * properties and methods from public instances.
	 *
	 * Additionally it implements "idleTimeout" and "continuousUpdates" static property
	 * accessors to give a control over the behavior of ResizeObserverController
	 * instance. Changes made to these properties will affect all future and
	 * existing observers.
	 */
	
	var ResizeObserver = function () {
	    /**
	     * Creates a new instance of ResizeObserver.
	     *
	     * @param {Function} callback - Callback which will
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
	                throw new TypeError('type of "idleTimeout" value must be a number.');
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
	                throw new TypeError('type of "continuousUpdates" value must be a boolean.');
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
	 * A collection of shims that provided minimal
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
	            var ctx = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
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
	 * Creates a wrapper function which ensures that
	 * provided callback will be invoked only once
	 * during the specified delay.
	 *
	 * @param {Function} callback - Function to be invoked.
	 * @param {Number} [delay = 0] - Delay after which to invoke callback.
	 * @returns {Function}
	 */
	function debounce(callback) {
	    var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
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
	        var idleTimeout = arguments.length <= 0 || arguments[0] === undefined ? 50 : arguments[0];
	        var continuousUpdates = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
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
	     * Starts the update cycle which will run either
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
	
	        // A registry of ResizeObservation instances.
	        this._targets = new _es6Collections.Map();
	
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
	     * and collects observation instances whose associated element
	     * has changes in its' content rectangle.
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
	
	// Placeholder of a content rectangle.
	var emptyRect = createContentRect(0, 0, 0, 0);
	
	var boxKeys = ['top', 'right', 'bottom', 'left'];
	
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
	    var result = value.replace('px', '');
	
	    result = parseFloat(result);
	
	    return isNaN(result) ? 0 : result;
	}
	
	/**
	 * Extracts computed width from provided styles.
	 *
	 * @param {CSSStyleDeclaration} styles
	 * @returns {Number}
	 */
	function getWidth(styles) {
	    return pixelsToNumber(styles.width);
	}
	
	/**
	 * Extracts computed height from provided styles.
	 *
	 * @param {CSSStyleDeclaration} styles
	 * @returns {Number}
	 */
	function getHeight(styles) {
	    return pixelsToNumber(styles.height);
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
	    // elements. Though elements whose width & height are less than 0.5 will
	    // be discarded as well.
	    //
	    // Without it we would need to implement separate methods for each of
	    // those cases and it's not possible to perform a precise and performance
	    // effective test for hidden elements. E.g. even jQuerys' ':visible' filter
	    // gives wrong results for elements whose width & height are less
	    // than 0.5.
	    if (!clientWidth && !clientHeight) {
	        return emptyRect;
	    }
	
	    var styles = getStyles(target);
	    var paddings = getPaddings(styles);
	    var horizPad = paddings.left + paddings.right;
	    var vertPad = paddings.top + paddings.bottom;
	
	    // Computed styles of width & height are being used because they
	    // are the only dimensions available to JS that contain non-rounded values. It could
	    // have been possible to utilize getBoundingClientRect if only its' data wasn't
	    // affected by CSS transformations let alone paddings, borders and scrollbars.
	    var width = getWidth(styles),
	        height = getHeight(styles);
	
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
	    // include scrollbars size which can be removed at this step as scrollbars
	    // are the only difference between rounded dimensions + paddings
	    // and "client" properties, though that is not always true in Chrome.
	    var scrollbarX = Math.round(width + horizPad) - clientWidth;
	    var scrollbarY = Math.round(height + vertPad) - clientHeight;
	
	    // Chrome has a rather weird rounding of "client" properties.
	    // E.g. for an element whose content width is 314.2px it sometimes
	    // gives the client width of 315px and for the width of 314.7px
	    // it may give 314px. And it doesn't happen all the time.
	    // This kind of difference needs to be ignored.
	    if (Math.abs(scrollbarX) !== 1) {
	        width -= scrollbarX;
	    }
	
	    if (Math.abs(scrollbarY) !== 1) {
	        height -= scrollbarY;
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
	 * Calculates an appropriate content rectangle
	 * for provided html or svg element.
	 *
	 * @param {Element} target - Element whose content rectangle
	 *      needs to be calculated.
	 * @returns {ClientRect}
	 */
	function getContentRect(target) {
	    return isSVGElement(target) ? getSVGContentRect(target) : getHTMLElementContentRect(target);
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
	    // are not writable and in native implementation
	    // they are also not enumerable.
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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	// randomColor by David Merfield under the CC0 license
	// https://github.com/davidmerfield/randomColor/
	
	;(function (root, factory) {
	
	  // Support AMD
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
	    // Support CommonJS
	  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
	    var randomColor = factory();
	
	    // Support NodeJS & Component, which allow module.exports to be a function
	    if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module && module.exports) {
	      exports = module.exports = randomColor;
	    }
	
	    // Support CommonJS 1.1.1 spec
	    exports.randomColor = randomColor;
	
	    // Support vanilla script loading
	  } else {
	    root.randomColor = factory();
	  }
	})(undefined, function () {
	
	  // Seed to get repeatable colors
	  var seed = null;
	
	  // Shared color dictionary
	  var colorDictionary = {};
	
	  // Populate the color dictionary
	  loadColorBounds();
	
	  var randomColor = function randomColor(options) {
	
	    options = options || {};
	
	    // Check if there is a seed and ensure it's an
	    // integer. Otherwise, reset the seed value.
	    if (options.seed && options.seed === parseInt(options.seed, 10)) {
	      seed = options.seed;
	
	      // A string was passed as a seed
	    } else if (typeof options.seed === 'string') {
	      seed = stringToInteger(options.seed);
	
	      // Something was passed as a seed but it wasn't an integer or string
	    } else if (options.seed !== undefined && options.seed !== null) {
	      throw new TypeError('The seed value must be an integer or string');
	
	      // No seed, reset the value outside.
	    } else {
	      seed = null;
	    }
	
	    var H, S, B;
	
	    // Check if we need to generate multiple colors
	    if (options.count !== null && options.count !== undefined) {
	
	      var totalColors = options.count,
	          colors = [];
	
	      options.count = null;
	
	      while (totalColors > colors.length) {
	
	        // Since we're generating multiple colors,
	        // incremement the seed. Otherwise we'd just
	        // generate the same color each time...
	        if (seed && options.seed) options.seed += 1;
	
	        colors.push(randomColor(options));
	      }
	
	      options.count = totalColors;
	
	      return colors;
	    }
	
	    // First we pick a hue (H)
	    H = pickHue(options);
	
	    // Then use H to determine saturation (S)
	    S = pickSaturation(H, options);
	
	    // Then use S and H to determine brightness (B).
	    B = pickBrightness(H, S, options);
	
	    // Then we return the HSB color in the desired format
	    return setFormat([H, S, B], options);
	  };
	
	  function pickHue(options) {
	
	    var hueRange = getHueRange(options.hue),
	        hue = randomWithin(hueRange);
	
	    // Instead of storing red as two seperate ranges,
	    // we group them, using negative numbers
	    if (hue < 0) {
	      hue = 360 + hue;
	    }
	
	    return hue;
	  }
	
	  function pickSaturation(hue, options) {
	
	    if (options.luminosity === 'random') {
	      return randomWithin([0, 100]);
	    }
	
	    if (options.hue === 'monochrome') {
	      return 0;
	    }
	
	    var saturationRange = getSaturationRange(hue);
	
	    var sMin = saturationRange[0],
	        sMax = saturationRange[1];
	
	    switch (options.luminosity) {
	
	      case 'bright':
	        sMin = 55;
	        break;
	
	      case 'dark':
	        sMin = sMax - 10;
	        break;
	
	      case 'light':
	        sMax = 55;
	        break;
	    }
	
	    return randomWithin([sMin, sMax]);
	  }
	
	  function pickBrightness(H, S, options) {
	
	    var bMin = getMinimumBrightness(H, S),
	        bMax = 100;
	
	    switch (options.luminosity) {
	
	      case 'dark':
	        bMax = bMin + 20;
	        break;
	
	      case 'light':
	        bMin = (bMax + bMin) / 2;
	        break;
	
	      case 'random':
	        bMin = 0;
	        bMax = 100;
	        break;
	    }
	
	    return randomWithin([bMin, bMax]);
	  }
	
	  function setFormat(hsv, options) {
	
	    switch (options.format) {
	
	      case 'hsvArray':
	        return hsv;
	
	      case 'hslArray':
	        return HSVtoHSL(hsv);
	
	      case 'hsl':
	        var hsl = HSVtoHSL(hsv);
	        return 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
	
	      case 'hsla':
	        var hslColor = HSVtoHSL(hsv);
	        return 'hsla(' + hslColor[0] + ', ' + hslColor[1] + '%, ' + hslColor[2] + '%, ' + Math.random() + ')';
	
	      case 'rgbArray':
	        return HSVtoRGB(hsv);
	
	      case 'rgb':
	        var rgb = HSVtoRGB(hsv);
	        return 'rgb(' + rgb.join(', ') + ')';
	
	      case 'rgba':
	        var rgbColor = HSVtoRGB(hsv);
	        return 'rgba(' + rgbColor.join(', ') + ', ' + Math.random() + ')';
	
	      default:
	        return HSVtoHex(hsv);
	    }
	  }
	
	  function getMinimumBrightness(H, S) {
	
	    var lowerBounds = getColorInfo(H).lowerBounds;
	
	    for (var i = 0; i < lowerBounds.length - 1; i++) {
	
	      var s1 = lowerBounds[i][0],
	          v1 = lowerBounds[i][1];
	
	      var s2 = lowerBounds[i + 1][0],
	          v2 = lowerBounds[i + 1][1];
	
	      if (S >= s1 && S <= s2) {
	
	        var m = (v2 - v1) / (s2 - s1),
	            b = v1 - m * s1;
	
	        return m * S + b;
	      }
	    }
	
	    return 0;
	  }
	
	  function getHueRange(colorInput) {
	
	    if (typeof parseInt(colorInput) === 'number') {
	
	      var number = parseInt(colorInput);
	
	      if (number < 360 && number > 0) {
	        return [number, number];
	      }
	    }
	
	    if (typeof colorInput === 'string') {
	
	      if (colorDictionary[colorInput]) {
	        var color = colorDictionary[colorInput];
	        if (color.hueRange) {
	          return color.hueRange;
	        }
	      }
	    }
	
	    return [0, 360];
	  }
	
	  function getSaturationRange(hue) {
	    return getColorInfo(hue).saturationRange;
	  }
	
	  function getColorInfo(hue) {
	
	    // Maps red colors to make picking hue easier
	    if (hue >= 334 && hue <= 360) {
	      hue -= 360;
	    }
	
	    for (var colorName in colorDictionary) {
	      var color = colorDictionary[colorName];
	      if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
	        return colorDictionary[colorName];
	      }
	    }return 'Color not found';
	  }
	
	  function randomWithin(range) {
	    if (seed === null) {
	      return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
	    } else {
	      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
	      var max = range[1] || 1;
	      var min = range[0] || 0;
	      seed = (seed * 9301 + 49297) % 233280;
	      var rnd = seed / 233280.0;
	      return Math.floor(min + rnd * (max - min));
	    }
	  }
	
	  function HSVtoHex(hsv) {
	
	    var rgb = HSVtoRGB(hsv);
	
	    function componentToHex(c) {
	      var hex = c.toString(16);
	      return hex.length == 1 ? '0' + hex : hex;
	    }
	
	    var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
	
	    return hex;
	  }
	
	  function defineColor(name, hueRange, lowerBounds) {
	
	    var sMin = lowerBounds[0][0],
	        sMax = lowerBounds[lowerBounds.length - 1][0],
	        bMin = lowerBounds[lowerBounds.length - 1][1],
	        bMax = lowerBounds[0][1];
	
	    colorDictionary[name] = {
	      hueRange: hueRange,
	      lowerBounds: lowerBounds,
	      saturationRange: [sMin, sMax],
	      brightnessRange: [bMin, bMax]
	    };
	  }
	
	  function loadColorBounds() {
	
	    defineColor('monochrome', null, [[0, 0], [100, 0]]);
	
	    defineColor('red', [-26, 18], [[20, 100], [30, 92], [40, 89], [50, 85], [60, 78], [70, 70], [80, 60], [90, 55], [100, 50]]);
	
	    defineColor('orange', [19, 46], [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]]);
	
	    defineColor('yellow', [47, 62], [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]]);
	
	    defineColor('green', [63, 178], [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]]);
	
	    defineColor('blue', [179, 257], [[20, 100], [30, 86], [40, 80], [50, 74], [60, 60], [70, 52], [80, 44], [90, 39], [100, 35]]);
	
	    defineColor('purple', [258, 282], [[20, 100], [30, 87], [40, 79], [50, 70], [60, 65], [70, 59], [80, 52], [90, 45], [100, 42]]);
	
	    defineColor('pink', [283, 334], [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]]);
	  }
	
	  function HSVtoRGB(hsv) {
	
	    // this doesn't work for the values of 0 and 360
	    // here's the hacky fix
	    var h = hsv[0];
	    if (h === 0) {
	      h = 1;
	    }
	    if (h === 360) {
	      h = 359;
	    }
	
	    // Rebase the h,s,v values
	    h = h / 360;
	    var s = hsv[1] / 100,
	        v = hsv[2] / 100;
	
	    var h_i = Math.floor(h * 6),
	        f = h * 6 - h_i,
	        p = v * (1 - s),
	        q = v * (1 - f * s),
	        t = v * (1 - (1 - f) * s),
	        r = 256,
	        g = 256,
	        b = 256;
	
	    switch (h_i) {
	      case 0:
	        r = v;g = t;b = p;break;
	      case 1:
	        r = q;g = v;b = p;break;
	      case 2:
	        r = p;g = v;b = t;break;
	      case 3:
	        r = p;g = q;b = v;break;
	      case 4:
	        r = t;g = p;b = v;break;
	      case 5:
	        r = v;g = p;b = q;break;
	    }
	
	    var result = [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
	    return result;
	  }
	
	  function HSVtoHSL(hsv) {
	    var h = hsv[0],
	        s = hsv[1] / 100,
	        v = hsv[2] / 100,
	        k = (2 - s) * v;
	
	    return [h, Math.round(s * v / (k < 1 ? k : 2 - k) * 10000) / 100, k / 2 * 100];
	  }
	
	  function stringToInteger(string) {
	    var total = 0;
	    for (var i = 0; i !== string.length; i++) {
	      if (total >= Number.MAX_SAFE_INTEGER) break;
	      total += string.charCodeAt(i);
	    }
	    return total;
	  }
	
	  return randomColor;
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=app.js.map