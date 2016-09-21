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

        // According to the specification following properties
        // are not writable and in native implementation
        // they are also not enumerable.
        const contentRect = Object.create(rectInterface, {
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
