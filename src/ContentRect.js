
export default class ContentRect {
    /**
     * Creates an instance of ContentRect.
     *
     * @param {Number} width - Rectangles' width.
     * @param {Number} height - Rectangles' height.
     * @param {Number} top - Paddings' top value.
     * @param {Number} left - Paddings' left value.
     */
    constructor(width, height, top, left) {
        // As for specification following properties
        // are not writable and in native implementation
        // they are also not enumerable.
        Object.defineProperties(this, {
            width:  {value: width},
            height: {value: height},
            top:    {value: top},
            left:   {value: left}
        });
    }
}
