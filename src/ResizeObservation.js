// Placeholder of a content rectangle.
const emptyRect = {
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};

/**
 * Extracts paddings data from the provided element.
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
* Subtracts paddings from provided
* dimensions and creates a content rectangle.
*
* @param {Number} clientWidth - Width including paddings.
* @param {Number} clientHeight - Height including paddings.
* @param {Object} paddings - Paddings data.
* @returns {ClientRect}
*/
function createContentRect(clientWidth, clientHeight, paddings) {
    const top = paddings.top;
    const left = paddings.left;

    const width = clientWidth - (left + paddings.right);
    const height = clientHeight - (top + paddings.bottom);

    return {
        width,
        height,
        top,
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

    return createContentRect(bbox.width, bbox.height, emptyRect);
}

/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element whose content
 *      rectangle needs to be calculated.
 * @returns {ClientRect}
 */
function getHTMLElementContentRect(target) {
    const width = target.clientWidth;
    const height = target.clientHeight;

    // It's not necessary to proceed with calculations
    // as it's already known that the rectangle is empty.
    if (!width && !height) {
        return emptyRect;
    }

    return createContentRect(width, height, getPaddings(target));
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
    return isSVGElement(target) ?
        getSVGContentRect(target) :
        getHTMLElementContentRect(target);
}

/**
 * Class that is responsible for computations of the
 * content rectangle of provided DOM element and
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
     * Updates 'broadcastWidth' and 'broadcastHeight'
     * properties with a data from the corresponding
     * properties of the last observed content rectangle.
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
     * Updates content rectangle and tells whether its'
     * width or height properties have changed since
     * the last broadcast.
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
