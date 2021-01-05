/**
 * A shim for the `Node.getRootNode()` API.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode for
 * more info.
 *
 * @param {Node} node
 * @returns {Node}
 */
export default function getRootNode(node) {
    if (typeof node.getRootNode === 'function') {
        return node.getRootNode();
    }
    let n;

    // eslint-disable-next-line no-empty
    for (n = node; n.parentNode; n = n.parentNode) {}

    return n;
}
