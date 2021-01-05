import ResizeObserverController from './ResizeObserverController.js';

/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
export default class GlobalResizeObserverController {
    /**
     * A mapping from a DOM root node and a respective controller. A root node
     * could be the main document, a same-origin iframe, or a shadow root.
     * See https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode
     * for more info.
     *
     * @private {Map<Node, ResizeObserverController>}
     */
    rootNodeControllers_ = typeof WeakMap !== 'undefined' ? new WeakMap() : new Map();

    /**
     * Holds reference to the controller's instance.
     *
     * @private {GlobalResizeObserverController}
     */
    static instance_ = null;

    /**
     * Adds observer to observers list.
     *
     * @param {Node} rootNode - The root node for which the observer is added.
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    addObserver(rootNode, observer) {
        let rootNodeController = this.rootNodeControllers_.get(rootNode);

        if (!rootNodeController) {
            rootNodeController = new ResizeObserverController(rootNode, this);
            this.rootNodeControllers_.set(rootNode, rootNodeController);
        }
        rootNodeController.addObserver(observer);
    }

    /**
     * Removes observer from observers list.
     *
     * @param {Node} rootNode - The root node from which the observer is removed.
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    removeObserver(rootNode, observer) {
        const rootNodeController = this.rootNodeControllers_.get(rootNode);

        if (rootNodeController) {
            rootNodeController.removeObserver(observer);
        }
    }

    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @param {Node} rootNode - The root node to refresh.
     * @returns {void}
     */
    refresh(rootNode) {
        const rootNodeController = this.rootNodeControllers_.get(rootNode);

        if (rootNodeController) {
            rootNodeController.refresh();
        }
    }

    /**
     * Returns instance of the GlobalResizeObserverController.
     *
     * @returns {GlobalResizeObserverController}
     */
    static getInstance() {
        if (!this.instance_) {
            this.instance_ = new GlobalResizeObserverController();
        }

        return this.instance_;
    }
}
