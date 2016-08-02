import ContentRect from './ContentRect';

export default class ResizeObserverEntry {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element being observed.
     * @param {...Number} rectData - Data of the elements' content rectangle.
     */
    constructor(target, ...rectData) {
        const contentRect = new ContentRect(...rectData);

        Object.defineProperties(this, {
            target:      {value: target},
            contentRect: {value: contentRect}
        });
    }
}
