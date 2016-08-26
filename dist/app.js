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
	
	var _randomcolor = __webpack_require__(10);
	
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
	        var dimensionsStr = rect.width + ' x ' + rect.height;
	
	        entry.target.firstElementChild.textContent = dimensionsStr;
	    }
	});
	
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
	
	function resizeElements() {
	    var blocks = document.querySelectorAll('.block');
	    var index = 0;
	
	    for (var _iterator2 = toArray(blocks), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	        var _ref2;
	
	        if (_isArray2) {
	            if (_i2 >= _iterator2.length) break;
	            _ref2 = _iterator2[_i2++];
	        } else {
	            _i2 = _iterator2.next();
	            if (_i2.done) break;
	            _ref2 = _i2.value;
	        }
	
	        var block = _ref2;
	
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
	    }
	
	    document.body.style.backgroundColor = generateColor();
	
	    setTimeout(resizeElements, 2500);
	}
	
	generateElements(document.getElementById('container'), 3);
	
	for (var _iterator3 = toArray(document.querySelectorAll('.leaf')), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
	    var _ref3;
	
	    if (_isArray3) {
	        if (_i3 >= _iterator3.length) break;
	        _ref3 = _iterator3[_i3++];
	    } else {
	        _i3 = _iterator3.next();
	        if (_i3.done) break;
	        _ref3 = _i3.value;
	    }
	
	    var leaf = _ref3;
	
	    observer.observe(leaf);
	}
	
	setTimeout(resizeElements, 2000);
	setInterval(updateColorData, 10000);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _es6Collections = __webpack_require__(2);
	
	var _ResizeObserverController = __webpack_require__(3);
	
	var _ResizeObserverController2 = _interopRequireDefault(_ResizeObserverController);
	
	var _ResizeObserver2 = __webpack_require__(7);
	
	var _ResizeObserver3 = _interopRequireDefault(_ResizeObserver2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// Controller which will be passed to all instances of ResizeObserver.
	var controller = new _ResizeObserverController2.default();
	
	// Registry of an internal observers.
	var observers = new _es6Collections.WeakMap();
	
	/**
	 * ResizeObservers' "Proxy" class which is meant to hide private
	 * properties and methods from public instances.
	 *
	 * Additionally it implements "idleTimeout" and "trackHovers" static property
	 * accessors to give a control over the behavior of ResizeObserverController
	 * instance. Changes made to these properties will be applied to all future and
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
	            throw new TypeError("1 argument required, but only 0 present.");
	        }
	
	        var observer = new _ResizeObserver3.default(callback, controller, this);
	
	        // Register internal observer.
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
	         * Tells whether controller tracks "hover" event.
	         *
	         * @returns {Boolean}
	         */
	
	    }, {
	        key: 'trackHovers',
	        get: function get() {
	            return controller.isHoverEnabled();
	        }
	
	        /**
	         * Enables or disables tracking of "hover" event.
	         *
	         * @param {Boolean} value - Whether to disable or enable tracking.
	         */
	        ,
	        set: function set(enable) {
	            if (typeof enable !== 'boolean') {
	                throw new TypeError('type of "trackHovers" value must be a boolean.');
	            }
	
	            enable ? controller.enableHover() : controller.disableHover();
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
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * A collection of shims that provided minimal
	 * support of WeakMap and Map classes.
	 *
	 * This implementation is not meant to be used outside of
	 * ResizeObserver modules as it covers only limited range
	 * of use cases.
	 */
	
	var hasNativeCollections = typeof window.WeakMap === 'function' && typeof window.Map === 'function';
	
	var WeakMap = function () {
	    if (hasNativeCollections) {
	        return window.WeakMap;
	    }
	
	    /**
	     *
	     * @param {Array<Array>} arr
	     * @param {Object} key
	     * @returns {Number}
	     */
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
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _performance = __webpack_require__(4);
	
	var _performance2 = _interopRequireDefault(_performance);
	
	var _requestAnimationFrame = __webpack_require__(5);
	
	var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);
	
	var _animations = __webpack_require__(6);
	
	var animations = _interopRequireWildcard(_animations);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
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
	
	            callback.apply(_this, args);
	        }, delay);
	    };
	}
	
	/**
	 * Controller class which is used to handle updates of registered ResizeObservers instances.
	 * It controls when and for how long it's necessary to run updates by listening to a combination
	 * of DOM events along with tracking of DOM mutations (nodes removal, changes of attributes, etc.).
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
	 * Infinite update cycle will be used in case when MutatioObserver is not supported.
	 */
	
	var ResizeObserverController = function () {
	    /**
	     * Creates a new ResizeObserverController instance.
	     *
	     * @param {Number} [idleTimeout = 0]
	     * @pram {Boolean} [trackHovers = false] - Whether to track "mouseover"
	     *      events or not. Disabled be default.
	     */
	    function ResizeObserverController() {
	        var idleTimeout = arguments.length <= 0 || arguments[0] === undefined ? 50 : arguments[0];
	        var trackHovers = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	        _classCallCheck(this, ResizeObserverController);
	
	        this._idleTimeout = idleTimeout;
	        this._trackHovers = trackHovers;
	        this._cycleStartTime = 0;
	        this._cycleDuration = 0;
	        this._cycleHadChanges = false;
	
	        this._isCycleRepeatable = false;
	
	        // Indicates whether the update of observers is scheduled.
	        this._isScheduled = false;
	
	        // Indicates whether infinite cycle is enabled.
	        this._isCycleInfinite = false;
	
	        // Indicates whether "mouseover" event handler was added.
	        this._hoverInitiated = false;
	
	        // Indicates whether DOM listeners have been initiated.
	        this._isListening = false;
	
	        // Keeps reference to the instance of MutationObserver.
	        this._mutationsObserver = null;
	
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
	        // update cycle when infinite cycles are enabled.
	        this._inifiniteCycleHandler = debounce(this._startAnimationCycle, 300);
	
	        // Limit the amount of calls from "mouseover" event.
	        this._onHover = debounce(this._startAnimationCycle, 200);
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
	
	        // Add listeners if they
	        // haven't been instantiated yet.
	        if (!this._isListening) {
	            this._initListeners();
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
	        if (!observers.length && this._isListening) {
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
	     * @returns {Boolean} Returns "true" if some observer
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
	     * Starts the update cycle which will run either until there
	     * are active animations or until specified minimal
	     * duration is reached.
	     *
	     * Cycle will repeat itself if one of its' iterations
	     * has detected changes in observers and if "repeatable" parameter
	     * is set to "true".
	     *
	     * @param {Number} [minDuration = 0] - Minimal duration of cycle.
	     * @param {Boolean} [repeatable = false] - Whether it is necessary
	     *      to repeat cycle when it detects changes.
	     */
	
	
	    ResizeObserverController.prototype.runUpdates = function runUpdates() {
	        var minDuration = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	        var repeatable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	        if (typeof minDuration !== 'number') {
	            minDuration = 0;
	        }
	
	        if (!this._isCycleRepeatable) {
	            this._isCycleRepeatable = repeatable;
	        }
	
	        // Update cycles' start time and duration if its'
	        // remaining time is lesser than provided duration.
	        if (minDuration >= this._getRemainingTime()) {
	            this._cycleStartTime = (0, _performance2.default)();
	            this._cycleDuration = minDuration;
	        }
	
	        this._scheduleUpdate();
	    };
	
	    /**
	     * Checks whether it's possible to detect active animations and invokes
	     * a single update if it's so. Otherwise it will
	     * start a repeatable cycle using provided duration.
	     *
	     * @private
	     * @param {Number} [duration = this._idleTimeout] - Duration of cycle.
	     */
	
	
	    ResizeObserverController.prototype._startAnimationCycle = function _startAnimationCycle(duration) {
	        if (typeof duration !== 'number') {
	            duration = this._idleTimeout;
	        }
	
	        !this._canDetectAnimations() ? this.runUpdates(duration, true) : this.runUpdates();
	    };
	
	    /**
	     * Schedules the update of observers.
	     *
	     * @private
	     */
	
	
	    ResizeObserverController.prototype._scheduleUpdate = function _scheduleUpdate() {
	        if (!this._isScheduled) {
	            this._isScheduled = true;
	
	            (0, _requestAnimationFrame2.default)(this._resolveScheduled);
	        }
	    };
	
	    /**
	     * Invokes the update of observers. It will schedule
	     * a new update if there are active animations or if
	     * minimal duration of cycle hasn't been reached yet.
	     *
	     * @private
	     */
	
	
	    ResizeObserverController.prototype._resolveScheduled = function _resolveScheduled() {
	        var hasChanges = this._updateObservers();
	
	        this._isScheduled = false;
	
	        if (hasChanges) {
	            this._cycleHadChanges = true;
	        }
	
	        this._shouldContinueUpdating() ? this._scheduleUpdate() : this._updatesFinished();
	    };
	
	    /**
	     * Tells whether it's necessary to continue
	     * running updates or that the update cycle can be finished.
	     *
	     * @returns {Boolean}
	     */
	
	
	    ResizeObserverController.prototype._shouldContinueUpdating = function _shouldContinueUpdating() {
	        return animations.hasReflowAnimations() || this._getRemainingTime() > 0;
	    };
	
	    /**
	     * Computes remaining time of the update cycle.
	     *
	     * @private
	     * @returns {Number} Remaining time in milliseconds.
	     */
	
	
	    ResizeObserverController.prototype._getRemainingTime = function _getRemainingTime() {
	        var timePassed = (0, _performance2.default)() - this._cycleStartTime;
	
	        return Math.max(this._cycleDuration - timePassed, 0);
	    };
	
	    /**
	     * Callback that will be invoked after
	     * the update cycle is finished.
	     *
	     * @private
	     */
	
	
	    ResizeObserverController.prototype._updatesFinished = function _updatesFinished() {
	        // We don't need to repeat the cycle if it's
	        // previous iteration hasn't detected changes.
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
	    };
	
	    /**
	     * Initializes DOM listeners.
	     *
	     * @private
	     */
	
	
	    ResizeObserverController.prototype._initListeners = function _initListeners() {
	        // Do nothing if listeners have been already initiated.
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
	
	        // Fall back to an infinite cycle.
	        if (!mutationsSupported) {
	            this._isCycleInfinite = true;
	
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
	    };
	
	    /**
	     * Removes all DOM listeners.
	     *
	     * @private
	     */
	
	
	    ResizeObserverController.prototype._removeListeners = function _removeListeners() {
	        // Do nothing if listeners have been already removed.
	        if (!this._isListening) {
	            return;
	        }
	
	        window.removeEventListener('resize', this._startAnimationCycle, true);
	
	        document.removeEventListener('animationstart', this._onAnimationStart, true);
	        document.removeEventListener('transitionstart', this._onTransitionStart, true);
	
	        this._removeHoverListener();
	
	        if (this._mutationsObserver) {
	            this._mutationsObserver.disconnect();
	        }
	
	        this._mutationsObserver = null;
	        this._isCycleInfinite = false;
	        this._isListening = false;
	    };
	
	    /**
	     * Enables "hover" listener.
	     */
	
	
	    ResizeObserverController.prototype.enableHover = function enableHover() {
	        this._trackHovers = true;
	
	        // Immediately add listener if the rest
	        // of listeners have been already initiated.
	        if (this._isListening) {
	            this._addHoverListener();
	        }
	    };
	
	    /**
	     * Disables "hover" listener.
	     */
	
	
	    ResizeObserverController.prototype.disableHover = function disableHover() {
	        this._trackHovers = false;
	
	        this._removeHoverListener();
	    };
	
	    /**
	     * Tells whether "hover" listener is enabled.
	     *
	     * @returns {Boolean}
	     */
	
	
	    ResizeObserverController.prototype.isHoverEnabled = function isHoverEnabled() {
	        return this._trackHovers;
	    };
	
	    /**
	     * Adds "mouseover" listener to the document.
	     *
	     * @private
	     */
	
	
	    ResizeObserverController.prototype._addHoverListener = function _addHoverListener() {
	        if (!this._hoverInitiated) {
	            this._hoverInitiated = true;
	
	            document.addEventListener('mouseover', this._onHover, true);
	        }
	    };
	
	    /**
	     * Removes "mouseover" listener from document.
	     *
	     * @private
	     */
	
	
	    ResizeObserverController.prototype._removeHoverListener = function _removeHoverListener() {
	        if (this._hoverInitiated) {
	            this._hoverInitiated = false;
	
	            document.removeEventListener('mouseover', this._onHover, true);
	        }
	    };
	
	    /**
	     * Tells whether it's possible to detect active animations
	     * either by using "getAnimations" method or by listening
	     * to "transitionstart" event.
	     *
	     * @private
	     * @returns {Boolean}
	     */
	
	
	    ResizeObserverController.prototype._canDetectAnimations = function _canDetectAnimations() {
	        return animations.isGetAnimationsSupported() || animations.isTransitionStartSupported();
	    };
	
	    /**
	     * "Transitionstart" event handler. Starts a single update cycle
	     * with a timeout value that is equal to transitions' duration.
	     *
	     * @private
	     * @param {TransitionEvent} event
	     */
	
	
	    ResizeObserverController.prototype._onTransitionStart = function _onTransitionStart(event) {
	        var duration = animations.computeDuration(event.target);
	
	        this.runUpdates(duration);
	    };
	
	    /**
	     * "Animationstart" event handler. It starts a repeatable
	     * update cycle with a timeout value that is equal to the
	     * duration of animation.
	     *
	     * @private
	     * @param {AnimationEvent} event
	     */
	
	
	    ResizeObserverController.prototype._onAnimationStart = function _onAnimationStart(event) {
	        var duration = animations.computeDuration(event.target, true);
	
	        this.runUpdates(duration, true);
	    };
	
	    /**
	     * DOM mutations handler.
	     *
	     * @private
	     * @param {Array<MutationRecord>} entries
	     */
	
	
	    ResizeObserverController.prototype._onMutation = function _onMutation(entries) {
	        // Check if at least one entry
	        // contains attributes changes.
	        var attrsChanged = entries.some(function (entry) {
	            return entry.type === 'attributes';
	        });
	
	        // It's expected that animations will start
	        // only after some attribute changes its' value.
	        attrsChanged ? this._startAnimationCycle() : this.runUpdates();
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
	    }]);
	
	    return ResizeObserverController;
	}();
	
	exports.default = ResizeObserverController;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
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
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
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
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.computeDuration = computeDuration;
	exports.getReflowAnimations = getReflowAnimations;
	exports.hasReflowAnimations = hasReflowAnimations;
	exports.isGetAnimationsSupported = isGetAnimationsSupported;
	exports.isTransitionStartSupported = isTransitionStartSupported;
	// A list of substrings of CSS properties
	// whose alteration will lead to a DOM reflow.
	var reflowKeys = ['top', 'left', 'right', 'bottom', 'width', 'height', 'weight', 'size'];
	
	// A regular expression which is used to extract data from
	// a string whose value is in a form of "{Number}(ms|s)".
	var durationRegExp = /^(-?\d*\.?\d+)(ms|s)$/;
	
	// Flag which indicates the support of "getAnimations" method.
	var hasGetAnimations = false;
	
	// Flag which indicates the support of "transitionstart" event.
	var hasTransitionStart = false;
	
	// Test whether "transitionstart" event is supported.
	(function (testStartEvent) {
	    document.readyState === 'loading' ? document.addEventListener('readystatechange', testStartEvent, false) : testStartEvent();
	})(function () {
	    // Unfortunately there is no other way to perform this test but to
	    // try to trigger the 'transitionstart' event. It can't
	    // be detected neither by checking for an existence of the corresponding
	    // property in document nor by the assignment of an inline
	    // event handler with 'ontransitionstart' attribute.
	    var span = document.createElement('span');
	
	    span.style.opacity = '0';
	    span.style.transition = 'opacity 1s';
	
	    span.addEventListener('transitionstart', function () {
	        hasTransitionStart = true;
	    }, false);
	
	    document.body.appendChild(span);
	
	    setTimeout(function () {
	        span.style.opacity = '1';
	
	        // Timeout is needed because event
	        // will be triggered asynchronously.
	        setTimeout(function () {
	            document.body.removeChild(span);
	            span = null;
	        }, 10);
	    }, 1);
	});
	
	/**
	 * Checks whether provided property exists in
	 * "source" object and that it's a function.
	 *
	 * @param {String} target - Name of the property.
	 * @param {Object} source - Object that contains property.
	 * @returns {Boolean}
	 */
	function isFunction(target, source) {
	    return source && (typeof source === 'undefined' ? 'undefined' : _typeof(source)) === 'object' && target in source && typeof source[target] === 'function';
	}
	
	/**
	 * Checks whether provided animation instance
	 * may lead to a DOM reflow.
	 *
	 * @param {Animation} animation - Animation to be checked.
	 * @return {Boolean}
	 */
	function isReflowAnimation(animation) {
	    var property = animation.transitionProperty;
	
	    // Always return "true" if it's not possible
	    // to define the type of animation.
	    if (!property) {
	        return true;
	    }
	
	    // Check if transition property corresponds
	    // to some of the reflow properties.
	    return reflowKeys.some(function (key) {
	        return !~property.indexOf(key);
	    });
	}
	
	/**
	 * Converts provided string to a number
	 * which represents value in milliseconds.
	 *
	 * @param {String} duration - String in a form of "{Number}(ms|s)".
	 * @returns {Number}
	 */
	function toMilliseconds(duration) {
	    var _durationRegExp$exec = durationRegExp.exec(duration);
	
	    var value = _durationRegExp$exec[1];
	    var unit = _durationRegExp$exec[2];
	
	
	    return parseFloat(value) * (unit === 'ms' ? 1 : 1000);
	}
	
	/**
	 * For provided element computes the sum of longest transition duration
	 * with longest transition delay. Can also be used to compute
	 * the duration of elements' animation.
	 *
	 * @param {Element} target - Element whose "duration"
	 *      needs to be computed.
	 * @param {Boolean} [computeAnimation = false] - Flag which specifies what
	 *      kind of duration to compute: animation or transition.
	 * @returns {Number} Duration in milliseconds.
	 */
	function computeDuration(target) {
	    var computeAnimation = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	    var type = computeAnimation ? 'animation' : 'transition';
	
	    var style = window.getComputedStyle(target);
	    var delays = style[type + 'Delay'];
	    var durations = style[type + 'Duration'];
	
	    if (durations === '0s') {
	        return 0;
	    }
	
	    var getMax = function getMax(a, b) {
	        return Math.max(a, toMilliseconds(b));
	    };
	
	    return durations.split(', ').reduce(getMax, 0) + delays.split(', ').reduce(getMax, 0);
	}
	
	/**
	 * Returns an array of existing animations if native
	 * "getAnimations" method is supported.
	 *
	 * @returns {Array<Animation>}
	 */
	var getAnimations = exports.getAnimations = function () {
	    if (isFunction('getAnimations', document)) {
	        hasGetAnimations = true;
	
	        return function () {
	            return document.getAnimations();
	        };
	    }
	
	    // Chrome (as for v51) implements 'getAnimations' method
	    // in a default timeline object.
	    if (isFunction('getAnimations', document.timeline)) {
	        hasGetAnimations = true;
	
	        return function () {
	            return document.timeline.getAnimations();
	        };
	    }
	
	    return function () {
	        return [];
	    };
	}();
	
	/**
	 * Returns a collection of existing animations
	 * that may lead to a DOM reflow.
	 *
	 * @returns {Array<Animation>}
	 */
	function getReflowAnimations() {
	    return getAnimations().filter(isReflowAnimation);
	}
	
	/**
	 * Tells whether there are any "reflow" animations.
	 *
	 * @returns {Boolean}
	 */
	function hasReflowAnimations() {
	    return !!getReflowAnimations().length;
	}
	
	/**
	 * Tells whether "getAnimations" method exists
	 * in document or document.timeline.
	 *
	 * @returns {Boolean}
	 */
	function isGetAnimationsSupported() {
	    return hasGetAnimations;
	}
	
	/**
	 * Tells whether "transitionstart" event is supported.
	 *
	 * @returns {Boolean}
	 */
	function isTransitionStartSupported() {
	    return hasTransitionStart;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _es6Collections = __webpack_require__(2);
	
	var _ResizeObservation = __webpack_require__(8);
	
	var _ResizeObservation2 = _interopRequireDefault(_ResizeObservation);
	
	var _ResizeObserverEntry = __webpack_require__(9);
	
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
	     * @param {ResizeObserver} [publicObserver = this] - Reference
	     *      to a public ResizeObserver instance which will be passed
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
	
	        // Public ResizeObserver instance that will be passed
	        // to callback function.
	        this._publicObserver = publicObserver || this;
	    }
	
	    /**
	     * Starts observing provided element.
	     *
	     * @param {Element} target - Element to be observed.
	     */
	
	
	    ResizeObserver.prototype.observe = function observe(target) {
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
	
	        // Connect observer to controller
	        // if it hasn't been connected yet.
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
	
	        if (!targets.size) {
	            this.disconnect();
	        }
	    };
	
	    /**
	     * Stops observing all elements and
	     * clears observations list.
	     */
	
	
	    ResizeObserver.prototype.disconnect = function disconnect() {
	        this.clearActive();
	        this._targets.clear();
	
	        this._controller.disconnect(this);
	    };
	
	    /**
	     * Invokes initial callback function passing to it a list
	     * of ResizeObserverEntry instances collected from
	     * active resize observations.
	     */
	
	
	    ResizeObserver.prototype.broadcastActive = function broadcastActive() {
	        if (!this.hasActive()) {
	            return;
	        }
	
	        var publicObserver = this._publicObserver;
	
	        var entries = this._activeTargets.map(function (observation) {
	            observation.broadcastRect();
	
	            return new _ResizeObserverEntry2.default(observation.target, observation.getLastObservedRect());
	        });
	
	        this.clearActive();
	
	        this._callback.call(publicObserver, entries, publicObserver);
	    };
	
	    /**
	     * Clears the collection of a pending/active observations.
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
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// Placeholder of the content rectangle.
	var emptyRect = {
	    width: 0,
	    height: 0,
	    top: 0,
	    right: 0,
	    bottom: 0,
	    left: 0
	};
	
	/**
	 * Extracts paddings data from provided element.
	 *
	 * @param {Element} target - Element whose paddings to be extracted.
	 * @returns {Object} Object that contains
	 *      left, top, right and bottom padding values.
	 */
	function getPaddings(target) {
	    var styles = window.getComputedStyle(target);
	    var keys = ['top', 'right', 'bottom', 'left'];
	
	    var paddings = {};
	
	    for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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
	
	        var value = styles['padding-' + key].replace('px', '');
	
	        paddings[key] = parseFloat(value);
	    }
	
	    return paddings;
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
	 * Calculates content rectangle of provided SVG element.
	 *
	 * @param {SVGElement} target - Element whose content
	 *      rectangle needs to be calculated.
	 * @returns {ClientRect}
	 */
	function getSVGContentRect(target) {
	    var bbox = target.getBBox();
	    var width = bbox.width;
	    var height = bbox.height;
	
	    return {
	        width: width,
	        height: height,
	        top: 0,
	        right: width,
	        bottom: height,
	        left: 0
	    };
	}
	
	/**
	 * Calculates content rectangle of provided HTMLElement.
	 *
	 * @param {HTMLElement} target - Element whose content
	 *      rectangle needs to be calculated.
	 * @returns {ClientRect}
	 */
	function getHTMLElementContentRect(target) {
	    var clientWidth = target.clientWidth;
	    var clientHeight = target.clientHeight;
	
	    // It's not necessary to proceed with calculations
	    // because we already know that rectangle is empty.
	    if (!clientWidth && !clientHeight) {
	        return emptyRect;
	    }
	
	    var paddings = getPaddings(target);
	
	    return {
	        width: clientWidth - (paddings.left + paddings.right),
	        height: clientHeight - (paddings.top + paddings.bottom),
	        top: paddings.top,
	        right: clientWidth - paddings.right,
	        bottom: clientHeight - paddings.bottom,
	        left: paddings.left
	    };
	}
	
	/**
	 * Calculates an appropriate content rectangle
	 * for provided html or svg element.
	 *
	 * @param {Element} target - Element whose content rectangle
	 *      needs to be calculated.
	 * @returns {ClientRect}
	 */
	function calculateContentRect(target) {
	    return isSVGElement(target) ? getSVGContentRect(target) : getHTMLElementContentRect(target);
	}
	
	/**
	 * Class that is responsible for computations of a
	 * content rectangle of observed DOM element and
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
	     * Returns last observed content rectangle.
	     *
	     * @returns {ClientRect}
	     */
	
	
	    ResizeObservation.prototype.getLastObservedRect = function getLastObservedRect() {
	        return this._contentRect;
	    };
	
	    /**
	     * Updates 'broadcastWidth' and 'broadcastHeight'
	     * properties with data from the corresponding
	     * properties of the last observed content rectangle.
	     */
	
	
	    ResizeObservation.prototype.broadcastRect = function broadcastRect() {
	        var rect = this._contentRect;
	
	        this.broadcastWidth = rect.width;
	        this.broadcastHeight = rect.height;
	    };
	
	    /**
	     * Updates content rectangle and tells whether its'
	     * width or height properties have changed since
	     * the last broadcast.
	     *
	     * @returns {Boolean}
	     */
	
	
	    ResizeObservation.prototype.isActive = function isActive() {
	        var rect = calculateContentRect(this.target);
	
	        this._contentRect = rect;
	
	        return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
	    };
	
	    return ResizeObservation;
	}();
	
	exports.default = ResizeObservation;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ResizeObserverEntry =
	/**
	 * Creates an instance of ResizeObserverEntry.
	 *
	 * @param {Element} target - Element which is being observed.
	 * @param {ClientRect} rectData - Data of the elements' content rectangle.
	 */
	function ResizeObserverEntry(target, rectData) {
	    _classCallCheck(this, ResizeObserverEntry);
	
	    var contentRect = {};
	
	    // According to the specification following properties
	    // are not writable and in native implementation
	    // they are also not enumerable.
	    Object.defineProperties(contentRect, {
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
/* 10 */
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