/**
 * Defines properties for the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @param {Object} [descr = {}] - Descriptor of the properties.
 * @returns {Object} Target object.
 */
function defineProperties(target, props, descr = {}) {
    const descriptor = {
        configurable: descr.configurable || false,
        writable: descr.writable || false,
        enumerable: descr.enumerable || false
    };

    for (const key of Object.keys(props)) {
        descriptor.value = props[key];

        Object.defineProperty(target, key, descriptor);
    }

    return target;
}

export default class ResizeObserverEntry {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {ClientRect} rectData - Data of the elements' content rectangle.
     */
    constructor(target, rectData) {
        // Content rectangle needs to be an instance
        // of ClientRect if it's available.
        const rectInterface = window.ClientRect ?
            ClientRect.prototype :
            Object.prototype;

        const contentRect = Object.create(rectInterface);

        // According to the specification following properties
        // are not writable and are also not enumerable in the
        // native implementation.
        defineProperties(contentRect, {
            top: rectData.top,
            right: rectData.right,
            bottom: rectData.bottom,
            left: rectData.left,
            width: rectData.width,
            height: rectData.height
        }, {configurable: true});

        defineProperties(this, {
            target, contentRect
        }, {configurable: true});
    }
}
