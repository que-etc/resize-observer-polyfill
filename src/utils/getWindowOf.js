import global from '../shims/global.js';

/**
 * Checks that target has a defaultView
 * @param  {Object} target
 * @returns {boolean}
 */
function checkDefaultViewExisting(target) {
    const simplyExists = target &&
    target.ownerDocument &&
    target.ownerDocument.defaultView;

    /**
   * That case will work when target is an element inside of detached iframe.
   * In Chrome it will end up with null by "target.ownerDocument.defaultView" path
   * but in IE11 it will become a window with bunch of undefined properties so
   * we should follow the duck typing way.
   */
    const nonEmptyWindow = !!(simplyExists && target.ownerDocument.defaultView.Object);

    return nonEmptyWindow;
}

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
export default target => {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    const ownerGlobal = checkDefaultViewExisting(target) ?
        target.ownerDocument.defaultView :
        null;

    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global;
};
