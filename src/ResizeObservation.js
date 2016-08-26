// Placeholder of the content rectangle.
const emptyRect = {
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
    const styles = window.getComputedStyle(target);
    const keys = ['top', 'right', 'bottom', 'left'];
    
    const paddings = {};

    for (const key of keys) {
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
 * @returns {ClientRect}
 */
function getSVGContentRect(target) {
    const bbox = target.getBBox();
    const width = bbox.width;
    const height = bbox.height;

    return {
        width,
        height,
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
    const clientWidth = target.clientWidth;
    const clientHeight = target.clientHeight;

    // It's not necessary to proceed with calculations
    // because we already know that rectangle is empty.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }

    const paddings = getPaddings(target);

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
    return isSVGElement(target) ?
        getSVGContentRect(target) :
        getHTMLElementContentRect(target);
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
    getLastObservedRect() {
        return this._contentRect;
    }
    
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight'
     * properties with data from the corresponding
     * properties of the last observed content rectangle.
     */
    broadcastRect() {
        const rect = this._contentRect;

        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
    }

    /**
     * Updates content rectangle and tells whether its'
     * width or height properties have changed since
     * the last broadcast.
     *
     * @returns {Boolean}
     */
    isActive() {
        const rect = calculateContentRect(this.target);

        this._contentRect = rect;

        return (
            rect.width !== this.broadcastWidth ||
            rect.height !== this.broadcastHeight
        );
    }
}
