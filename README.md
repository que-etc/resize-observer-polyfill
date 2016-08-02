ResizeObserver Polyfill
=============

A polyfill for ResizeObserver API.

Implements event based tracking of changes in elements dimensions. Uses MutationsObserver and falls back to an infinite dirty checking cycle if the first one is not supported. Handles long running CSS transitions/animations, attributes and nodes mutations along with changes made by :hover pseudo-class (optional).

Written in ES6 and compliant with the [spec](http://rawgit.com/WICG/ResizeObserver/master/index.html). Doesn't contain any publicly available methods or properties except for those described in the spec. Size is 4.4kb when minified and gzipped.

[Live demo](http://que-etc.github.io/resize-observer-polyfill) (won't run in IE9).

## Installation

From NPM:

```sh
npm install --save git+https://git@github.com/que-etc/resize-observer-polyfill.git
```

Or just grab one of the pre-built versions from [`dist`](https://github.com/que-etc/resize-observer-polyfill/tree/master/dist).

## Browser Support

Polyfill has been tested and known to work in the following browsers:

* Chrome 40+
* Opera 30+
* Firefox 31+
* Edge 13+
* Internet Explorer 11
* Internet Explorer 9-10 (tested in compatibility mode of IE11)
* Safari was not tested but expected to work

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

As browsers' global:

```xml
<script src="resize-observer-polyfill/dist/ResizeObserver.js"></script>
<script>
    (function () {
        var observer = new ResizeObserver(function () {});
    })();
</script>
```
### Global exports

Optionally you can take a version that extends browsers' global object.

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

### idleTimeot

In the first place this implementation relies on `transitionstart` & `animationstart` events or documents' `getAnimations` method for tracking active animations. If some of the above approaches is not supported it will use a repeatable update cycle whose minimal duration equals to the `idleTimeout` value. This cycle will be used only after mutations of DOM attributes like `class` or `style` and it will repeat itself when it detects changes in elemenets that are observed.

Default timeout value is `50` milliseconds and you can increase it to match the delay of transitions, e.g. when transition starts with the delay of `500` milliseconds you can set `ResizeObserver.idleTimeout = 500` to the corresponding value.
Note that even if transitions don't have a delay it's still safer to leave the default value.

### trackHovers

By default possible changes in elements size caused by CSS `:hover` class are not tracked. You can set `ResizeObserver.trackHovers = true` if you need them to be supported. Keep in mind that this is going to affect the performance.

**NOTE:** Changes made to these properties will affect all existing and future instances of ResizeObserver.
