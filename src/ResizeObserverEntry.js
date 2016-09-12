export default class ResizeObserverEntry {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {ClientRect} rectData - Data of the elements' content rectangle.
     */
    constructor(target, rectData) {
        const contentRect = {};

        // According to the specification following properties
        // are not writable and in native implementation
        // they are also not enumerable.
        Object.defineProperties(contentRect, {
            width: {value: rectData.width},
            height: {value: rectData.height},
            top: {value: rectData.top},
            right: {value: rectData.right},
            bottom: {value: rectData.bottom},
            left: {value: rectData.left}
        });

        Object.defineProperties(this, {
            target: {value: target},
            contentRect: {value: contentRect}
        });
    }
}
