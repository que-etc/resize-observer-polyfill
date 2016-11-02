/**
 * Defines properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @param {Object} [descr = {}] - Properties descriptor.
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
        // Content rectangle needs to be an instance of ClientRect if it's
        // available.
        const rectInterface = window.ClientRect || Object;
        const contentRect = Object.create(rectInterface.prototype);

        // According to the specification following properties are not writable
        // and are also not enumerable in the native implementation.
        //
        // Property accessors are not being used as they'd require to define a
        // private WeakMap storage which may cause memory leaks in browsers that
        // don't support this type of collections.
        defineProperties(contentRect, rectData, {configurable: true});

        defineProperties(this, {
            target, contentRect
        }, {configurable: true});
    }
}
