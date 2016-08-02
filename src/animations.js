// A list of substrings of CSS properties
// whose alteration will lead to a DOM reflow.
const reflowKeys = [
    'top',
    'left',
    'right',
    'bottom',
    'width',
    'height',
    'weight',
    'size'
];

// A regular expression which is used to extract data from
// a string whose value is in a form of "{Number}(ms|s)".
const durationRegExp = /^(-?\d*\.?\d+)(ms|s)$/;

// Flag which marks the support of "getAnimations" method.
let hasGetAnimations = false;

// Flag which marks the support of "transitionstart" event.
let hasTransitionStart = false;

// Test for "transitionstart" event support.
(testStartEvent => {
    document.readyState === 'loading' ?
        document.addEventListener('readystatechange', testStartEvent, false) :
        testStartEvent();
})(() => {
    // Unfortunately there is no other way to perform this test but to
    // try to trigger the 'transitionstart' event. It can't
    // be detected neither by checking for an existence of the corresponding
    // property in document nor by the assignment of inline
    // event handler with 'ontransitionstart' attribute.
    let span = document.createElement('span');

    span.style.opacity = '0';
    span.style.transition = 'opacity 1s';

    span.addEventListener('transitionstart', () => {
        hasTransitionStart = true;
    }, false);

    document.body.appendChild(span);

    setTimeout(() => {
        span.style.opacity = '1';

        // Timeout is needed because event
        // will be triggered asynchronously.
        setTimeout(() => {
            document.body.removeChild(span);
            span = null;
        }, 10);
    }, 0);
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
    return (
        source &&
        typeof source === 'object' &&
        target in source &&
        typeof source[target] === 'function'
    );
}

/**
 * Checks whether provided animation instance
 * may lead to a DOM reflow.
 *
 * @param {Animation} animation - Animation to be checked.
 * @return {Boolean}
 */
function isReflowAnimation(animation) {
    const property = animation.transitionProperty;

    // Always return "true" if it's not possible
    // to define the type of animation.
    if (!property) {
        return true;
    }

    // Check if transition property corresponds
    // to some of the reflow properties.
    return reflowKeys.some(key => !~property.indexOf(key));
}

/**
 * Converts provided string to a number
 * which represents value in milliseconds.
 *
 * @param {String} duration - String in a form of "{Number}(ms|s)".
 * @returns {Number}
 */
function toMilliseconds(duration) {
    const [,value, unit] = durationRegExp.exec(duration);

    return parseFloat(value) * (unit === 'ms' ? 1: 1000);
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
export function computeDuration(target, computeAnimation = false) {
    const type = computeAnimation ? 'animation' : 'transition';

    const style = window.getComputedStyle(target);
    const delays = style[type + 'Delay'];
    const durations = style[type + 'Duration'];

    if (durations === '0s') {
        return 0;
    }

    const getMax = (a, b) => Math.max(a, toMilliseconds(b));

    return (
        durations.split(', ').reduce(getMax, 0) +
        delays.split(', ').reduce(getMax, 0)
    );
}

/**
 * Returns an array of existing animations if native
 * 'getAnimations' method is supported.
 *
 * @returns {Array<Animation>}
 */
export const getAnimations = (function () {
    if (isFunction('getAnimations', document)) {
        hasGetAnimations = true;

        return () => document.getAnimations();
    }

    // Chrome (as for v51) implements 'getAnimations' method
    // in a default timeline object.
    if (isFunction('getAnimations', document.timeline)) {
        hasGetAnimations = true;

        return () => document.timeline.getAnimations();
    }

    return () => [];
})();

/**
 * Returns a collection of existing animations
 * that may lead to DOM reflow.
 *
 * @returns {Array<Animation>}
 */
export function getReflowAnimations() {
    return getAnimations().filter(isReflowAnimation);
}

/**
 * Tells whether there are any "reflow" animations.
 *
 * @returns {Boolean}
 */
export function hasReflowAnimations() {
    return !!getReflowAnimations().length;
}

/**
 * Tells whether 'getAnimations' method exists
 * in document or document.timeline.
 *
 * @returns {Boolean}
 */
export function isGetAnimationsSupported() {
    return hasGetAnimations;
}

/**
 * Tells whether 'transitionstart' event is supported.
 *
 * @returns {Boolean}
 */
export function isTransitionStartSupported() {
    return hasTransitionStart;
}
