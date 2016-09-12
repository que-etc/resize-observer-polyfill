ResizeObserver Polyfill
=============

[![Build Status][travis-image]][travis-url]


A polyfill for ResizeObserver API.

Implements event based tracking of changes in the dimensions of elements. Uses MutationsObserver and falls back to an infinite dirty checking cycle if the first one is not supported. Handles long running CSS transitions/animations, attributes and nodes mutations along with changes made by :hover pseudo-class (optional).

Compliant with the [spec](http://rawgit.com/WICG/ResizeObserver/master/index.html). Doesn't contain any publicly available methods except for those described in the spec. Size is 3.4kb when minified and gzipped.

[Live demo](http://que-etc.github.io/resize-observer-polyfill) (won't run in IE9).

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
* Opera 30+
* Firefox 31+
* Safari 9+
* Edge 13+
* Internet Explorer 11
* _Internet Explorer 9-10_ (tested in compatibility mode of IE11)

**NOTE:** Internet Explorer 8 and its earlier versions are not supported.

## Usage Examples

If you are using ES6 modules with bundlers like [Webpack](https://webpack.github.io/) or [JSPM](http://jspm.io/):

```javascript
import ResizeObserver from 'resize-observer-polyfill';

const observer = new ResizeObserver((entries, observer) => {});

observer.observe(document.body);
// ...
```

Alternatively you can take a pre-built UMD version.

With AMD:

```javascript
define([
    'resize-observer-polyfill/dist/ResizeObserver'
], function (ResizeObserver) {
    // ...
});
```

With CommonJS:

```javascript
var ResizeObserver = require('resize-observer-polyfill/dist/ResizeObserver');
```

As a browsers' global object:

```xml
<script src="resize-observer-polyfill/dist/ResizeObserver.js"></script>
<script>
    (function () {
        var observer = new ResizeObserver(function () {});
    })();
</script>
```
### Global exports

You can also take a version that always extends browsers' global object.

With ES6 modules:

```javascript
import 'resize-observer-polyfill/index.global';

const observer = new ResizeObserver(() => {});
```

With AMD/CommonJS:

```javascript
require('resize-observer-polyfill/dist/ResizeObserver.global');
```

## Configuration

`ResizeObserver` class additionally implements following static accessor properties:

### idleTimeout

After the mutations of DOM attributes, like `class` or `style`, an update cycle will be started which will run either until the dimensions of observed elements keep changing or the `idleTimeout` is reached. This approach is used to handle transitions and animations.

Default timeout value is `50` milliseconds and you can increase it to match the delay of transitions, e.g. when transition starts with the delay of `500` milliseconds you can set `ResizeObserver.idleTimeout = 500` to the corresponding value.

Note that even if transitions don't have a delay it's still better to leave this value as it is.

### continuousUpdates

By default possible changes in dimensions of elements caused by CSS `:hover` class are not tracked. To handle them you can set `ResizeObserver.continuousUpdtaes = true` which in turn will start a continuous update cycle with an interval of `200` milliseconds (using RAF, of course). Keep in mind that this is going to affect the performance.

**NOTE:** Changes made to these properties will affect all existing and future instances of ResizeObserver.

## Building and testing

First make sure that you have all dependencies installed by running `npm install`. Then you can execute following tasks either with a gulp CLI or with `npm run gulp` command.

To make a production build:

```sh
gulp build:production
```

To make a development build of polyfill itself (including sourcemap).
Files will be located in `tmp` folder:

```sh
gulp build:dev
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

If you want to test some specific browser that is not present in karmas' config file you'll need
to run `gulp test:spec:manual` and then navigate to the `http://localhost:9876/debug.html` page.

And if you need to run tests against native implementation you'll additionally need to remove top imports from the `ResizeObserver.spec.js` test suite.

[travis-image]: https://travis-ci.org/que-etc/resize-observer-polyfill.svg?branch=master
[travis-url]: https://travis-ci.org/que-etc/resize-observer-polyfill

