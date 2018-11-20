// Returns global object of a current environment.

let _global;

if (process.env.BROWSER) {
    _global = window;
} else if (typeof global !== 'undefined' && global.Math === Math) {
    _global = global;
} else if (typeof self !== 'undefined' && self.Math === Math) {
    _global = self;
} else if (typeof window !== 'undefined' && window.Math === Math) {
    _global = window;
} else {
    // eslint-disable-next-line no-new-func
    _global = Function('return this')();
}

export default _global;
