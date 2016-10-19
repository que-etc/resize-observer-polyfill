ResizeObserver Polyfill
=============

[![Build Status][travis-image]][travis-url]


A polyfill for the Resize Observer API.

Implements event based tracking of changes in the content dimensions of elements, i.e. no polling (in the general case) unless DOM is mutated or the `resize` event is triggered. Uses MutationsObserver and falls back to an infinite dirty checking cycle if the first one is not supported. Handles long running CSS transitions/animations and can optionally observe resizing of a `<textarea>` element along with changes caused by the `:hover` pseudo-class.

Compliant with the [spec](http://rawgit.com/WICG/ResizeObserver/master/index.html) and the native implementation. Doesn't contain any publicly available methods except for those described in the spec. The size is _3.6kb_ when minified and gzipped.

[Live demo](http://que-etc.github.io/resize-observer-polyfill) (has style problems in IE10 and lower).

## Installation

From NPM:

```sh
npm install --save resize-observer-polyfill
```

From Bower:

```sh
bower install --save resize-observer-polyfill
```

Or just grab one of the pre-built versions from [`dist`](https://github.com/que-etc/resize-observer-polyfill/tree/master/dist).

## Browser Support

Polyfill has been tested and known to work in the following browsers:

* Chrome 40+
* Firefox 37+
* Safari 9+, _including mobile_
* Opera 30+
* Edge 13+
* Internet Explorer 9+

**NOTE:** Internet Explorer 8 and its earlier versions are not supported.

## Usage Examples

It's recommended to use this library in the form of the [ponyfill](https://github.com/sindresorhus/ponyfill), which doesn't inflict modifications of the global object.

With ES6 modules:

```javascript
import ResizeObserver from 'resize-observer-polyfill';

const ro = new ResizeObserver((entries, observer) => {
    const entry = entries[0];
    const cr = entry.contentRect;

    console.log('Element:', entry.target);
    console.log(`Element size: ${cr.width}px x ${cr.height}px`);
    console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
});

ro.observe(document.body);
```

As a pre-built ES5 UMD module.

AMD:

```javascript
define([
    'resize-observer-polyfill/dist/ResizeObserver'
], function (ResizeObserver) {
    // ...
});
```

CommonJS:

```javascript
var ResizeObserver = require('resize-observer-polyfill/dist/ResizeObserver');
```

As a browsers' global object:

```xml
<script src="resize-observer-polyfill/dist/ResizeObserver.js"></script>
<script>
    (function () {
        var ro = new ResizeObserver(function () {});
    })();
</script>
```
### Global exports

Use following versions in case if you need to export polyfill globally.

With ES6 modules:

```javascript
import 'resize-observer-polyfill/index.global';

const ro = new ResizeObserver(() => {});
```

As UMD module: `resize-observer-polyfill/dist/ResizeObserver.global`.

You can also take the minified bundles: `ResizeObserver.min.js` or `ResizeObserver.global.min.js`.

## Configuration

`ResizeObserver` class additionally implements following static accessor properties:

### idleTimeout

After the mutations of DOM attributes, like `class` or `style`, the update cycle will be started which will run either until the dimensions of observed elements keep changing or the `idleTimeout` is reached. This approach is used to handle transitions and animations.

Default timeout value is `50` milliseconds and you can increase it to match the delay of transitions, e.g. if the delay is `500` milliseconds you can set `ResizeObserver.idleTimeout = 500` to the corresponding value.

Note that even if transitions are meant to start "immediately" it's still better to leave this value as it is. And you can set this property to zero if you don't need transitions to be tracked.

### continuousUpdates

By default resizing of a `<textarea>` element and changes caused by the CSS `:hover` pseudo-class are not tracked. To handle them you can set `ResizeObserver.continuousUpdtaes = true` which in turn will start a continuous update cycle with the interval of `100` milliseconds (using RAF, of course). Keep in mind that this is going to affect the performance.

**NOTE:** changes made to these properties will affect all existing and future instances of ResizeObserver.

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

Functional tests for all available browsers that are
defined in `karma.config.js` file:
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

