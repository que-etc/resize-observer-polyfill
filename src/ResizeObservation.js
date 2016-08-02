import ResizeObserverEntry from './ResizeObserverEntry';

// A placeholder object that is used when clientWidth
// and clientHeight properties of an element are empty.
const emptyPaddings = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
};

const paddingKeys = Object.keys(emptyPaddings);

/**
 * Extracts paddings data from provided element.
 *
 * @param {Element} target - Element whose paddings to be extracted.
 * @returns {Object} Object that contains
 *      left, top, right and bottom padding values.
 */
function getPaddings(target) {
    const styles = window.getComputedStyle(target);
    const paddings = {};

    for (const key of paddingKeys) {
        const value = styles['padding-' + key].replace('px', '');

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
 * @returns {ContentRect}
 */
function getSVGContentRect(target) {
    const bcr = target.getBBox();

    return {
        width: bcr.width,
        height: bcr.height,
        top: 0, left: 0
    };
}

/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element whose content
 *      rectangle needs to be calculated.
 * @returns {ContentRect}
 */
function getHTMLElementsContentRect(target) {
    let width    = target.clientWidth,
        height   = target.clientHeight,
        paddings = emptyPaddings;

    // It's necessary to calculate paddings
    // only when client rectangle is not empty.
    if (width || height) {
        paddings = getPaddings(target);
    }

    width -= paddings.left + paddings.right;
    height -= paddings.top + paddings.bottom;

    return {
        width, height,
        top: paddings.top,
        left: paddings.left
    };
}

/**
 * Defines what type of an element is provided
 * (SVGElement or HTMLElement) and calculates an
 * appropriate content rectangle for it.
 *
 * @param {Element} target - Element whose content rectangle
 *      needs to be calculated.
 * @returns {ContentRect}
 */
function calculateContentRect(target) {
    return isSVGElement(target) ?
        getSVGContentRect(target) :
        getHTMLElementsContentRect(target);
}


/**
 * Class that is responsible for computations of a
 * content rectangle of observed DOM element and
 * for keeping track of its' changes.
 */
export default class ResizeObservation {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element whose content
     *      rectangle needs to be observed.
     */
    constructor(target) {
        this.target = target;

        // Keeps state of content rectangle.
        this._contentRect = null;

        // Last broadcasted width of content rectangle.
        this.broadcastWidth = 0;

        // Last broadcasted height of content rectangle.
        this.broadcastHeight = 0;
    }

    /**
     * Tells whether content rectangle has changed its'
     * width or height properties since the last broadcast.
     *
     * @returns {Boolean}
     */
    isActive() {
        const contentRect = this._updateContentRect();

        return (
            contentRect.width !== this.broadcastWidth ||
            contentRect.height !== this.broadcastHeight
        );
    }

    /**
     * Returns a new instance of ResizeObsreverEntry passing to
     * it data of the last updated content rectangle and updates
     * corresponding 'broadcastWidth' and 'broadcastHeight' properties.
     *
     * @returns {ResizeObsreverEntry}
     */
    broadcastEntry() {
        const rect = this._contentRect;

        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;

        return new ResizeObserverEntry(
            this.target,
            rect.width,
            rect.height,
            rect.top,
            rect.left
        );
    }

    /**
     * Updates dimensions of content rectangle
     * and returns its' instance.
     *
     * @private
     * @returns {ContentRect}
     */
    _updateContentRect() {
        this._contentRect = calculateContentRect(this.target);

        return this._contentRect;
    }
}
