ResizeObserver Polyfill
=============

[![Build Status][travis-image]][travis-url]


A polyfill for the Resize Observer API.

Implementation is based on the MutationObserver (no polling unless DOM changes) with a fall back to a continuous dirty checking cycle if the first one is not supported. Handles non-delayed CSS transitions/animations and can optionally observe resizing of a `<textarea>` element along with changes caused by the `:hover` pseudo-class.

Compliant with the [spec](http://rawgit.com/WICG/ResizeObserver/master/index.html) and the native implementation. Doesn't contain any publicly available methods except for those described in spec. The size is _3.0kb_ when minified and gzipped.

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

### Local export
It's recommended to use this library in the form of the [ponyfill](https://github.com/sindresorhus/ponyfill), which doesn't inflict modifications of the global object.

```javascript
import ResizeObserver from 'resize-observer-polyfill';

const ro = new ResizeObserver((entries, observer) => {
    for (const entry of entries) {
        const cr = entry.contentRect;

        console.log('Element:', entry.target);
        console.log(`Element's size: ${cr.width}px x ${cr.height}px`);
        console.log(`Element's paddings: ${cr.top}px ; ${cr.left}px`);
    }
});

ro.observe(document.body);
```

Package's main file is a ES5 [UMD](https://github.com/umdjs/umd) module and it will be dynamically substituted by the ES6 version for those bundlers that are aware of the [jnext:main](https://github.com/rollup/rollup/wiki/jsnext:main) or `module` fields, e.g. for [Rollup](https://github.com/rollup/rollup).

In case you want to specify which version to use, you can either take `resize-observer-polyfill/index` for ES6 modules or `resize-observer-polyfill/dist/ResizeObserver` for UMD.

### Global export
Use following versions if you want polyfill to extend global object.

ES6 module:

```javascript
import 'resize-observer-polyfill/index.global';

const ro = new ResizeObserver(() => {});
```

UMD version: `resize-observer-polyfill/dist/ResizeObserver.global`.

You can also take minified bundles: `ResizeObserver.min.js` or `ResizeObserver.global.min.js`.

## Configuration

`ResizeObserver` class additionally implements following static accessor property:

### continuousUpdates

By default things like resizing of a `<textarea>` element,  changes caused by the CSS `:hover` pseudo-class and delayed CSS transitions are not tracked. To handle them you can set `ResizeObserver.continuousUpdates = true` which in turn will start a continuous update cycle which runs every `100` milliseconds (as a RAF callback, of course). Keep in mind that this is going to affect the performance.

**NOTE:** changes made to this property affect all existing and future instances of ResizeObserver.

## Building and testing

First make sure that you have all dependencies installed by running `npm install`. Then you can execute following tasks either with a gulp CLI or with the `npm run gulp` command.

To build polyfill. This will create UMD bundles in the `dist` folder:

```sh
gulp build
```

To run a code style test:
```sh
gulp test:lint
```

Functional tests for all available browsers defined in `karma.config.js` file:
```sh
gulp test:spec
```

To test in a browser that is not present in karmas' config file:
```sh
gulp test:spec:custom
```

Testing against a native implementation:
```sh
gulp test:spec:native
```

**NOTE:** after you invoke `spec:native` and `spec:custom` commands head to the `http://localhost:9876/debug.html` page.

[travis-image]: https://travis-ci.org/que-etc/resize-observer-polyfill.svg?branch=master
[travis-url]: https://travis-ci.org/que-etc/resize-observer-polyfill
