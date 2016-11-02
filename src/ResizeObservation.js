// Placeholder of an empty content rectangle.
const emptyRect = createContentRect(0, 0, 0, 0);

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
 * Converts provided string defined in q form of '{{value}}px' to number.
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
function getBordersSize(styles, ...positions) {
    return positions.reduce((size, pos) => {
        const value = styles['border-' + pos + '-width'];

        return size + pixelsToNumber(value);
    }, 0);
}

/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    const boxKeys = ['top', 'right', 'bottom', 'left'];
    const paddings = {};

    for (const key of boxKeys) {
        const value = styles['padding-' + key];

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
        width, height, top,
        right: width + left,
        bottom: height + top,
        left
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
    const bbox = target.getBBox();

    return createContentRect(bbox.width, bbox.height, 0, 0);
}

/**
 * Calculates content rectangle of a root element.
 *
 * @returns {ClientRect}
 */
function getDocElementRect() {
    // Neither scroll[Width/Height] nor offset[Width/Height] can be used to
    // define content dimensions as they give inconsistent results across
    // different browsers. E.g. in the Internet Explorer 10 and lower value of
    // these properties can't be less than the client dimensions (same thing
    // with the "getBoundingClientRect" method). And Firefox has the same
    // behavior with its "scroll" properties.
    const styles = getStyles(document.documentElement);

    const width = pixelsToNumber(styles.width);
    const height = pixelsToNumber(styles.height);

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
    const clientWidth = target.clientWidth;
    const clientHeight = target.clientHeight;

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

    const styles = getStyles(target);
    const paddings = getPaddings(styles);
    const horizPad = paddings.left + paddings.right;
    const vertPad = paddings.top + paddings.bottom;

    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize getBoundingClientRect if only its' data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    let width = pixelsToNumber(styles.width),
        height = pixelsToNumber(styles.height);

    // Width & height include paddings and borders
    // when 'border-box' box model is applied (except for IE).
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

    // In some browsers (only in Firefox, actually) CSS width & height
    // include scroll bars size which can be removed at this step as scroll bars
    // are the only difference between rounded dimensions + paddings and "client"
    // properties, though that is not always true in Chrome.
    const vertScrollbar = Math.round(width + horizPad) - clientWidth;
    const horizScrollbar = Math.round(height + vertPad) - clientHeight;

    // Chrome has a rather weird rounding of "client" properties.
    // E.g. for an element with content width of 314.2px it sometimes gives the
    // client width of 315px and for the width of 314.7px it may give 314px.
    // And it doesn't happen all the time. Such difference needs to be ignored.
    if (Math.abs(vertScrollbar) !== 1) {
        width -= vertScrollbar;
    }

    if (Math.abs(horizScrollbar) !== 1) {
        height -= horizScrollbar;
    }

    return createContentRect(width, height, paddings.top, paddings.left);
}

/**
 * Checks whether provided element is an instance of SVGElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {Boolean}
 */
function isSVGElement(target) {
    return target instanceof window.SVGElement;
}

/**
 * Checks whether provided element is a document element (root element of a document).
 *
 * @param {Element} target - Element to be checked.
 * @returns {Boolean}
 */
function isDocumentElement(target) {
    return target === document.documentElement;
}

/**
 * Calculates an appropriate content rectangle for provided html or svg element.
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
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of its' changes.
 */
export default class ResizeObservation {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element to be observed.
     */
    constructor(target) {
        this.target = target;

        // Keeps reference to the last observed content rectangle.
        this._contentRect = emptyRect;

        // Broadcasted width of content rectangle.
        this.broadcastWidth = 0;

        // Broadcasted height of content rectangle.
        this.broadcastHeight = 0;
    }

    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {ClientRect} Last observed content rectangle.
     */
    broadcastRect() {
        const rect = this._contentRect;

        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;

        return rect;
    }

    /**
     * Updates content rectangle and tells whether its' width or height properties
     * have changed since the last broadcast.
     *
     * @returns {Boolean}
     */
    isActive() {
        const rect = getContentRect(this.target);

        this._contentRect = rect;

        return (
            rect.width !== this.broadcastWidth ||
            rect.height !== this.broadcastHeight
        );
    }
}
