ResizeObserver Polyfill
=============

[![Build Status][travis-image]][travis-url]


A polyfill for the Resize Observer API.

Implementation is based on the MutationObserver (no polling unless DOM changes) with a fall back to a continuous dirty checking cycle if the first one is not supported. Doesn't modify observed elements. Handles CSS transitions/animations, `<textarea>` resizes and can possibly observe changes caused by dynamic CSS pseudo-classes, e.g. by `:hover`.

Compliant with the [spec](http://rawgit.com/WICG/ResizeObserver/master/index.html) and the native implementation. The size is _2.6kb_ when minified and gzipped.

[Live demo](http://que-etc.github.io/resize-observer-polyfill) (has style problems in IE10 and lower).

## Installation

From NPM:

```sh
npm install resize-observer-polyfill --save-dev
```

From Bower:

```sh
bower install resize-observer-polyfill --save-dev
```

Or just grab one of the pre-built versions from [`dist`](https://github.com/que-etc/resize-observer-polyfill/tree/master/dist).

## Browser Support

Polyfill has been tested and known to work in the following browsers:

* Chrome 40+ , _native since v54_
* Firefox 37+
* Safari 9+, _including mobile_
* Opera 30+
* Edge 13+
* Internet Explorer 9+

**NOTE:** Internet Explorer 8 and its earlier versions are not supported.

## Usage Examples

It's recommended to use this library in the form of a [ponyfill](https://github.com/sindresorhus/ponyfill), which doesn't inflict modifications of the global object.

```javascript
import ResizeObserver from 'resize-observer-polyfill';

const ro = new ResizeObserver((entries, observer) => {
    for (const entry of entries) {
        const {left, top, width, height} = entry.contentRect;

        console.log('Element:', entry.target);
        console.log(`Element's size: ${ width }px x ${ height }px`);
        console.log(`Element's paddings: ${ top }px ; ${ left }px`);
    }
});

ro.observe(document.body);
```
Though you always can extend the global object if you need it.

```javascript
import ResizeObserver from 'resize-observer-polyfill';

window.ResizeObserver = ResizeObserver;
```

Package's main file is a ES5 [UMD](https://github.com/umdjs/umd) module and it will be dynamically substituted by the ES6 version for those bundlers that are aware of the [jnext:main](https://github.com/rollup/rollup/wiki/jsnext:main) field, e.g. for [Rollup](https://github.com/rollup/rollup).

**Note**: global versions (`index.global` and `dist/ResizeObserver.global`) are deprecated and will be removed in the next major release.

## Limitations

* CSS changes caused by dynamic pseudo-classes, e.g. `:hover` and `:focus`, are not tracked. As a workaround you can add a short transition which would trigger the `transitionend` event when an element receives one of the former classes ([example](https://jsfiddle.net/que_etc/7fudzqng/)).
* Delayed transitions will receive only one notification with the latest dimensions of an element.


## Building and testing

To build polyfill. Creates UMD bundle in the `dist` folder:

```sh
npm run build
```

To run a code style test:
```sh
npm run test:lint
```

Running unit tests:
```sh
npm run test:spec
```

To test in a browser that is not present in karma's config file:
```sh
npm run test:spec:custom
```

Testing against a native implementation:
```sh
npm run test:spec:native
```

**NOTE:** after you invoke `spec:native` and `spec:custom` commands head to the `http://localhost:9876/debug.html` page.

[travis-image]: https://travis-ci.org/que-etc/resize-observer-polyfill.svg?branch=master
[travis-url]: https://travis-ci.org/que-etc/resize-observer-polyfill
