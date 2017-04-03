/* eslint-disable max-nested-callbacks, no-shadow, require-jsdoc */
import {ResizeObserver, ResizeObserverEntry} from './resources/observer';
import {createAsyncSpy, wait} from './resources/helpers';

let observer = null,
    observer2 = null,
    elements = {},
    styles;

// eslint-disable-next-line no-empty-function
const emptyFn = () => {};
const css = `
    #root {
        display: inline-block;
    }

    #container {
        min-width: 600px;
        background: #37474f;
    }

    #target1, #target2 {
        width: 200px;
        height: 200px;
    }

    #target1 {
        background: #4285f4;
    }

    #target2 {
        background: #fbbc05;
    }
`;
const template = `
    <div id="root">
        <div id="container">
            <div id="target1"></div>
            <div id="target2"></div>
        </div>
    </div>
`;

const timeout = 300;

function appendStyles() {
    styles = document.createElement('style');

    styles.id = 'styles';
    document.head.appendChild(styles);

    styles.innerHTML = css;
}

function removeStyles() {
    document.head.removeChild(styles);

    styles = null;
}

function appendElements() {
    document.body.insertAdjacentHTML('beforeend', template);

    elements = {
        root: document.getElementById('root'),
        container: document.getElementById('container'),
        target1: document.getElementById('target1'),
        target2: document.getElementById('target2'),
        target3: document.getElementById('target3')
    };
}

function removeElements() {
    if (document.body.contains(elements.root)) {
        document.body.removeChild(elements.root);
    }

    elements = {};
}

describe('ResizeObserver', () => {
    beforeEach(() => {
        appendStyles();
        appendElements();
    });

    afterEach(() => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        if (observer2) {
            observer2.disconnect();
            observer2 = null;
        }

        removeStyles();
        removeElements();
    });

    describe('constructor', () => {
        /* eslint-disable no-new */
        it('throws an error if no arguments are provided', () => {
            expect(() => {
                new ResizeObserver();
            }).toThrowError(/1 argument required/i);
        });

        it('throws an error if callback is not a function', () => {
            expect(() => {
                new ResizeObserver(true);
            }).toThrowError(/function/i);

            expect(() => {
                new ResizeObserver({});
            }).toThrowError(/function/i);

            expect(() => {
                new ResizeObserver(emptyFn);
            }).not.toThrow();
        });

        /* eslint-enable no-new */
    });

    describe('observe', () => {
        it('throws an error if no arguments are provided', () => {
            observer = new ResizeObserver(emptyFn);

            expect(() => {
                observer.observe();
            }).toThrowError(/1 argument required/i);
        });

        it('throws an error if target is not an Element', () => {
            observer = new ResizeObserver(emptyFn);

            expect(() => {
                observer.observe(true);
            }).toThrowError(/Element/i);

            expect(() => {
                observer.observe(null);
            }).toThrowError(/Element/i);

            expect(() => {
                observer.observe({});
            }).toThrowError(/Element/i);

            expect(() => {
                observer.observe(document.createTextNode(''));
            }).toThrowError(/Element/i);
        });

        it('triggers when observation begins', done => {
            observer = new ResizeObserver(done);

            observer.observe(elements.target1);
        });

        it('triggers with correct arguments', done => {
            observer = new ResizeObserver(function (...args) {
                const [entries, instance] = args;

                expect(args.length).toEqual(2);

                expect(Array.isArray(entries)).toBe(true);
                expect(entries.length).toEqual(1);

                expect(entries[0] instanceof ResizeObserverEntry).toBe(true);

                expect(entries[0].target).toBe(elements.target1);
                expect(typeof entries[0].contentRect).toBe('object');

                expect(instance).toBe(observer);

                // eslint-disable-next-line no-invalid-this
                expect(this).toBe(observer);

                done();
            });

            observer.observe(elements.target1);
        });

        it('preserves the initial order of elements', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target2);
            observer.observe(elements.target1);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(2);

                expect(entries[0].target).toBe(elements.target2);
                expect(entries[1].target).toBe(elements.target1);
            }).then(async () => {
                elements.target1.style.height = '400px';
                elements.target2.style.height = '100px';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(2);

                expect(entries[0].target).toBe(elements.target2);
                expect(entries[1].target).toBe(elements.target1);
            }).then(done).catch(done.fail);
        });

        // Checks that gathering of active observations and broadcasting of
        // notifications happens in separate cycles.
        it('doesn\'t block notifications when multiple observers are used', done => {
            const spy = createAsyncSpy();
            const spy2 = createAsyncSpy();

            const defaultWidth = getComputedStyle(elements.target1).width;

            let shouldRestoreDefault = false;

            observer = new ResizeObserver(() => {
                spy(...arguments);

                if (shouldRestoreDefault) {
                    elements.target1.style.width = defaultWidth;
                }
            });

            observer2 = new ResizeObserver(() => {
                spy2(...arguments);

                if (shouldRestoreDefault) {
                    elements.target1.style.width = defaultWidth;
                }
            });

            observer.observe(elements.target1);
            observer2.observe(elements.target1);

            Promise.all([
                spy.nextCall(),
                spy2.nextCall()
            ]).then(() => {
                shouldRestoreDefault = true;

                elements.target1.style.width = '220px';

                return Promise.all([
                    spy.nextCall().then(spy.nextCall),
                    spy2.nextCall().then(spy2.nextCall)
                ]);
            }).then(done).catch(done.fail);
        });

        it('doesn\'t notify of already observed elements', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);
            }).then(async () => {
                observer.observe(elements.target1);

                await wait(timeout);

                expect(spy).toHaveBeenCalledTimes(1);

                elements.target1.style.width = '220px';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);
            }).then(done).catch(done.fail);
        });

        it('handles elements that are not yet in the DOM', done => {
            elements.root.removeChild(elements.container);
            elements.container.removeChild(elements.target1);

            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            wait(timeout).then(() => {
                expect(spy).not.toHaveBeenCalled();
            }).then(async () => {
                elements.container.appendChild(elements.target1);

                await wait(timeout);

                expect(spy).not.toHaveBeenCalled();
            }).then(async () => {
                elements.root.appendChild(elements.container);

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);
            }).then(done).catch(done.fail);
        });

        it('triggers when an element is removed from DOM', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);
            observer.observe(elements.target2);

            spy.nextCall().then(entries => {
                expect(spy).toHaveBeenCalledTimes(1);

                expect(entries.length).toBe(2);

                expect(entries[0].target).toBe(elements.target1);
                expect(entries[1].target).toBe(elements.target2);
            }).then(async () => {
                elements.container.removeChild(elements.target1);

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(0);
                expect(entries[0].contentRect.height).toBe(0);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(0);
                expect(entries[0].contentRect.bottom).toBe(0);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                elements.root.removeChild(elements.container);

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target2);

                expect(entries[0].contentRect.width).toBe(0);
                expect(entries[0].contentRect.height).toBe(0);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(0);
                expect(entries[0].contentRect.bottom).toBe(0);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(done).catch(done.fail);
        });

        it('handles resizing of the documentElement', done => {
            const spy = createAsyncSpy();
            const docElement = document.documentElement;
            const styles = window.getComputedStyle(docElement);

            observer = new ResizeObserver(spy);

            observer.observe(document.documentElement);

            spy.nextCall().then(entries => {
                const width = parseFloat(styles.width);
                const height = parseFloat(styles.height);

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(docElement);

                expect(entries[0].contentRect.width).toBe(width);
                expect(entries[0].contentRect.height).toBe(height);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(width);
                expect(entries[0].contentRect.bottom).toBe(height);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                document.body.removeChild(elements.root);

                const width = parseFloat(styles.width);
                const height = parseFloat(styles.height);

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(docElement);

                expect(entries[0].contentRect.width).toBe(width);
                expect(entries[0].contentRect.height).toBe(height);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(width);
                expect(entries[0].contentRect.bottom).toBe(height);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(done).catch(done.fail);
        });

        it('handles hidden elements', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            elements.root.style.display = 'none';
            elements.target1.style.display = 'none';

            observer.observe(elements.target1);

            wait(timeout).then(() => {
                expect(spy).not.toHaveBeenCalled();
            }).then(async () => {
                elements.target1.style.display = 'block';

                await wait(timeout);

                expect(spy).not.toHaveBeenCalled();
            }).then(async () => {
                elements.root.style.display = 'block';
                elements.target1.style.position = 'fixed';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(200);
                expect(entries[0].contentRect.bottom).toBe(200);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                elements.root.style.display = 'none';
                elements.target1.style.padding = '10px';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(0);
                expect(entries[0].contentRect.height).toBe(0);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(0);
                expect(entries[0].contentRect.bottom).toBe(0);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(done).catch(done.fail);
        });

        it('handles empty elements', done => {
            const spy = createAsyncSpy();

            elements.target1.style.width = '0px';
            elements.target1.style.height = '0px';
            elements.target1.style.padding = '10px';

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);
            observer.observe(elements.target2);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target2);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(200);
                expect(entries[0].contentRect.bottom).toBe(200);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                elements.target1.style.width = '200px';
                elements.target1.style.height = '200px';

                elements.target2.style.width = '0px';
                elements.target2.style.height = '0px';
                elements.target2.padding = '10px';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(2);

                expect(entries[0].target).toBe(elements.target1);
                expect(entries[1].target).toBe(elements.target2);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);

                expect(entries[1].contentRect.width).toEqual(0);
                expect(entries[1].contentRect.height).toBe(0);
                expect(entries[1].contentRect.top).toBe(0);
                expect(entries[1].contentRect.right).toBe(0);
                expect(entries[1].contentRect.bottom).toBe(0);
                expect(entries[1].contentRect.left).toBe(0);
            }).then(done).catch(done.fail);
        });

        it('handles paddings', done => {
            const spy = createAsyncSpy();

            elements.target1.style.padding = '2px 4px 6px 8px';

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(2);
                expect(entries[0].contentRect.right).toBe(208);
                expect(entries[0].contentRect.bottom).toBe(202);
                expect(entries[0].contentRect.left).toBe(8);
            }).then(async () => {
                elements.target1.style.padding = '3px 6px';

                await wait(timeout);

                expect(spy).toHaveBeenCalledTimes(1);
            }).then(async () => {
                elements.target1.style.boxSizing = 'border-box';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(188);
                expect(entries[0].contentRect.height).toBe(194);
                expect(entries[0].contentRect.top).toBe(3);
                expect(entries[0].contentRect.right).toBe(194);
                expect(entries[0].contentRect.bottom).toBe(197);
                expect(entries[0].contentRect.left).toBe(6);
            }).then(async () => {
                elements.target1.style.padding = '0px 6px';

                const entries = await spy.nextCall();

                expect(spy).toHaveBeenCalledTimes(3);

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(188);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(194);
                expect(entries[0].contentRect.bottom).toBe(200);
                expect(entries[0].contentRect.left).toBe(6);
            }).then(async () => {
                elements.target1.style.padding = '0px';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(200);
                expect(entries[0].contentRect.bottom).toBe(200);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(done).catch(done.fail);
        });

        it('handles borders', done => {
            const spy = createAsyncSpy();

            elements.target1.style.border = '10px solid black';

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(200);
                expect(entries[0].contentRect.bottom).toBe(200);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                elements.target1.style.border = '5px solid black';

                await wait(timeout);

                expect(spy).toHaveBeenCalledTimes(1);
            }).then(async () => {
                elements.target1.style.boxSizing = 'border-box';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(190);
                expect(entries[0].contentRect.height).toBe(190);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(190);
                expect(entries[0].contentRect.bottom).toBe(190);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                elements.target1.style.borderTop = '';
                elements.target1.style.borderBottom = '';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(190);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(190);
                expect(entries[0].contentRect.bottom).toBe(200);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                elements.target1.style.borderLeft = '';
                elements.target1.style.borderRight = '';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(200);
                expect(entries[0].contentRect.bottom).toBe(200);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(done).catch(done.fail);
        });

        it('doesn\'t notify when position changes', done => {
            const spy = createAsyncSpy();

            elements.target1.style.position = 'relative';
            elements.target1.style.top = '7px';
            elements.target1.style.left = '5px;';
            elements.target1.style.padding = '2px 3px';

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(2);
                expect(entries[0].contentRect.right).toBe(203);
                expect(entries[0].contentRect.bottom).toBe(202);
                expect(entries[0].contentRect.left).toBe(3);
            }).then(async () => {
                elements.target1.style.left = '10px';
                elements.target1.style.top = '20px';

                await wait(timeout);

                expect(spy).toHaveBeenCalledTimes(1);
            }).then(done).catch(done.fail);
        });

        it('ignores scroll bars size', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            elements.root.style.width = '100px';
            elements.root.style.height = '250px';
            elements.root.style.overflow = 'auto';

            elements.container.style.minWidth = '0px';

            observer.observe(elements.root);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.root);

                expect(entries[0].contentRect.width).toBe(elements.root.clientWidth);
                expect(entries[0].contentRect.height).toBe(elements.root.clientHeight);

                // It is not possible to run further tests if browser has overlaid scroll bars.
                if (
                    elements.root.clientWidth === elements.root.offsetWidth &&
                    elements.root.clientHeight === elements.root.offsetHeight
                ) {
                    return Promise.resolve();
                }

                return (async () => {
                    const width = elements.root.clientWidth;

                    elements.target1.style.width = width + 'px';
                    elements.target2.style.width = width + 'px';

                    const entries = await spy.nextCall();

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.root);

                    expect(entries[0].contentRect.height).toBe(250);
                })().then(async () => {
                    elements.target1.style.height = '125px';
                    elements.target2.style.height = '125px';

                    const entries = await spy.nextCall();

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.root);

                    expect(entries[0].contentRect.width).toBe(100);
                });
            }).then(done).catch(done.fail);
        });

        it('doesn\'t trigger for a non-replaced inline elements', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            elements.target1.style.display = 'inline';
            elements.target1.style.padding = '10px';

            observer.observe(elements.target1);

            wait(timeout).then(() => {
                expect(spy).not.toHaveBeenCalled();
            }).then(async () => {
                elements.target1.style.position = 'absolute';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(10);
                expect(entries[0].contentRect.left).toBe(10);
            }).then(async () => {
                elements.target1.style.position = 'static';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(0);
                expect(entries[0].contentRect.height).toBe(0);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(0);
                expect(entries[0].contentRect.bottom).toBe(0);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                elements.target1.style.width = '150px';

                await wait(timeout);

                expect(spy).toHaveBeenCalledTimes(2);
            }).then(async () => {
                elements.target1.style.display = 'block';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(150);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(10);
                expect(entries[0].contentRect.left).toBe(10);
            }).then(async () => {
                elements.target1.style.display = 'inline';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBe(0);
                expect(entries[0].contentRect.height).toBe(0);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(0);
                expect(entries[0].contentRect.bottom).toBe(0);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(done).catch(done.fail);
        });

        it('handles replaced inline elements', done => {
            elements.root.insertAdjacentHTML('beforeend', `
                <input
                    id="replaced-inline"
                    style="width: 200px; height: 30px; padding: 5px 6px; border: 2px solid black;"/>
            `
            );

            const spy = createAsyncSpy();
            const replaced = document.getElementById('replaced-inline');

            observer = new ResizeObserver(spy);

            observer.observe(replaced);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(replaced);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(30);
                expect(entries[0].contentRect.top).toBe(5);
                expect(entries[0].contentRect.right).toBe(206);
                expect(entries[0].contentRect.bottom).toBe(35);
                expect(entries[0].contentRect.left).toBe(6);
            }).then(async () => {
                replaced.style.width = '190px';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(replaced);

                expect(entries[0].contentRect.width).toBe(190);
                expect(entries[0].contentRect.height).toBe(30);
                expect(entries[0].contentRect.top).toBe(5);
                expect(entries[0].contentRect.right).toBe(196);
                expect(entries[0].contentRect.bottom).toBe(35);
                expect(entries[0].contentRect.left).toBe(6);
            }).then(async () => {
                replaced.style.boxSizing = 'border-box';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(replaced);

                expect(entries[0].contentRect.width).toBe(174);
                expect(entries[0].contentRect.height).toBe(16);
                expect(entries[0].contentRect.top).toBe(5);
                expect(entries[0].contentRect.right).toBe(180);
                expect(entries[0].contentRect.bottom).toBe(21);
                expect(entries[0].contentRect.left).toBe(6);
            }).then(done).catch(done.fail);
        });

        it('handles fractional dimensions', done => {
            elements.target1.style.width = '200.5px';
            elements.target1.style.height = '200.5px';
            elements.target1.style.padding = '6.3px 3.3px';
            elements.target1.style.border = '11px solid black';

            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBeCloseTo(200.5, 1);
                expect(entries[0].contentRect.height).toBeCloseTo(200.5, 1);
                expect(entries[0].contentRect.top).toBeCloseTo(6.3, 1);
                expect(entries[0].contentRect.right).toBeCloseTo(203.8, 1);
                expect(entries[0].contentRect.bottom).toBeCloseTo(206.8, 1);
                expect(entries[0].contentRect.left).toBeCloseTo(3.3, 1);
            }).then(async () => {
                elements.target1.style.padding = '7.8px 3.8px';

                await wait(timeout);

                expect(spy).toHaveBeenCalledTimes(1);
            }).then(async () => {
                elements.target1.style.boxSizing = 'border-box';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBeCloseTo(170.9, 1);
                expect(entries[0].contentRect.height).toBeCloseTo(162.9, 1);
                expect(entries[0].contentRect.top).toBeCloseTo(7.8, 1);
                expect(entries[0].contentRect.right).toBeCloseTo(174.7, 1);
                expect(entries[0].contentRect.bottom).toBeCloseTo(170.7, 1);
                expect(entries[0].contentRect.left).toBeCloseTo(3.8, 1);
            }).then(async () => {
                elements.target1.style.padding = '7.9px 3.9px';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBeCloseTo(170.7, 1);
                expect(entries[0].contentRect.height).toBeCloseTo(162.7, 1);
                expect(entries[0].contentRect.top).toBeCloseTo(7.9, 1);
                expect(entries[0].contentRect.right).toBeCloseTo(174.6, 1);
                expect(entries[0].contentRect.bottom).toBeCloseTo(170.6, 1);
                expect(entries[0].contentRect.left).toBeCloseTo(3.9, 1);
            }).then(async () => {
                elements.target1.style.width = '200px';

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target1);

                expect(entries[0].contentRect.width).toBeCloseTo(170.2, 1);
                expect(entries[0].contentRect.height).toBeCloseTo(162.7, 1);
                expect(entries[0].contentRect.top).toBeCloseTo(7.9, 1);
                expect(entries[0].contentRect.right).toBeCloseTo(174.1, 1);
                expect(entries[0].contentRect.bottom).toBeCloseTo(170.6, 1);
                expect(entries[0].contentRect.left).toBeCloseTo(3.9, 1);
            }).then(done).catch(done.fail);
        });

        it('handles SVGGraphicsElement', done => {
            elements.root.insertAdjacentHTML('beforeend', `
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="100" height="100"
                    id="svg-root" style="padding: 5px;">
                    <rect
                        id="svg-rect"
                        x="10" y="10"
                        width="200" height="150"
                        style="stroke:#ff0000; fill: #0000ff"/>
                </svg>
            `);

            const spy = createAsyncSpy();
            const svgRoot = document.getElementById('svg-root');
            const svgRect = document.getElementById('svg-rect');

            observer = new ResizeObserver(spy);

            observer.observe(svgRect);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(svgRect);

                expect(entries[0].contentRect.width).toBe(200);
                expect(entries[0].contentRect.height).toBe(150);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(200);
                expect(entries[0].contentRect.bottom).toBe(150);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                svgRect.setAttribute('width', 250);
                svgRect.setAttribute('height', 200);

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(svgRect);

                expect(entries[0].contentRect.width).toBe(250);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(250);
                expect(entries[0].contentRect.bottom).toBe(200);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(async () => {
                observer.observe(svgRoot);

                const entries = await spy.nextCall();

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(svgRoot);

                expect(entries[0].contentRect.width).toBe(250);
                expect(entries[0].contentRect.height).toBe(200);
                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.right).toBe(250);
                expect(entries[0].contentRect.bottom).toBe(200);
                expect(entries[0].contentRect.left).toBe(0);
            }).then(done).catch(done.fail);
        });

        it('doesn\'t observe svg elements that don\'t implement the SVGGraphicsElement interface', done => {
            elements.root.insertAdjacentHTML('beforeend', `
                <svg width="600" height="200" viewBox="0 0 600 200"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                    <defs>
                        <radialGradient id="gradient">
                            <stop offset="0%" stop-color="#8cffa0" />
                            <stop offset="100%" stop-color="#8ca0ff" />
                        </radialGradient>
                    </defs>

                    <circle r="50" cx="180" cy="50" style="fill:url(#gradient)" id="circle" />
                </svg>
            `);

            const spy = createAsyncSpy();
            const svgGrad = document.getElementById('gradient');
            const svgCircle = document.getElementById('circle');

            observer = new ResizeObserver(spy);

            observer.observe(svgGrad);

            wait(timeout).then(() => {
                expect(spy).not.toHaveBeenCalled();

                observer.observe(svgCircle);

                return spy.nextCall();
            }).then(entries => {
                expect(spy).toHaveBeenCalledTimes(1);

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(svgCircle);

                expect(entries[0].contentRect.top).toBe(0);
                expect(entries[0].contentRect.left).toBe(0);
                expect(entries[0].contentRect.width).toBe(100);
                expect(entries[0].contentRect.height).toBe(100);
            }).then(done).catch(done.fail);
        });

        it('handles IE11 issue with the MutationObserver: https://jsfiddle.net/x2r3jpuz/2/', done => {
            const spy = createAsyncSpy();

            elements.root.insertAdjacentHTML('beforeend', `
                <p>
                    <strong></strong>
                </p>
            `);

            observer = new ResizeObserver(spy);

            observer.observe(elements.root);

            spy.nextCall().then(async () => {
                const elem = elements.root.querySelector('strong');

                // IE11 crashes at this step if MuatationObserver is used.
                elem.textContent = 'a';
                elem.textContent = 'b';

                await wait(timeout);
            }).then(done).catch(done.fail);
        });

        if (typeof document.body.style.transform !== 'undefined') {
            it('doesn\'t notify of transformations', done => {
                const spy = createAsyncSpy();

                observer = new ResizeObserver(spy);

                observer.observe(elements.target1);

                spy.nextCall().then(entries => {
                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.left).toBe(0);
                }).then(async () => {
                    elements.container.style.transform = 'scale(0.5)';
                    elements.target2.style.transform = 'scale(0.5)';

                    observer.observe(elements.target2);

                    const entries = await spy.nextCall();

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target2);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.left).toBe(0);
                }).then(async () => {
                    elements.container.style.transform = '';
                    elements.target2.style.transform = '';

                    await wait(timeout);

                    expect(spy).toHaveBeenCalledTimes(2);
                }).then(done).catch(done.fail);
            });
        }

        if (typeof document.body.style.transition !== 'undefined') {
            it('handles transitions', done => {
                elements.target1.style.transition = 'width 1s';

                const spy = createAsyncSpy();

                observer = new ResizeObserver(spy);

                observer.observe(elements.target1);

                spy.nextCall().then(async () => {
                    const transitionEnd = new Promise(resolve => {
                        const callback = () => {
                            elements.target1.removeEventListener('transitionend', callback);
                            resolve();
                        };

                        elements.target1.addEventListener('transitionend', callback);
                    });

                    await wait(20);

                    elements.target1.style.width = '600px';

                    await transitionEnd;
                    await wait(timeout);

                    // eslint-disable-next-line prefer-destructuring
                    const entries = spy.calls.mostRecent().args[0];

                    expect(entries[0].target).toBe(elements.target1);
                    expect(Math.round(entries[0].contentRect.width)).toBe(600);
                }).then(done).catch(done.fail);
            });
        }
    });

    describe('unobserve', () => {
        it('throws an error if no arguments have been provided', () => {
            observer = new ResizeObserver(emptyFn);

            expect(() => {
                observer.unobserve();
            }).toThrowError(/1 argument required/i);
        });

        it('throws an error if target is not an Element', () => {
            observer = new ResizeObserver(emptyFn);

            expect(() => {
                observer.unobserve(true);
            }).toThrowError(/Element/i);

            expect(() => {
                observer.unobserve(null);
            }).toThrowError(/Element/i);

            expect(() => {
                observer.unobserve({});
            }).toThrowError(/Element/i);

            expect(() => {
                observer.unobserve(document.createTextNode(''));
            }).toThrowError(/Element/i);
        });

        it('stops observing single element', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);
            observer.observe(elements.target2);

            spy.nextCall().then(entries => {
                expect(spy).toHaveBeenCalledTimes(1);

                expect(entries.length).toBe(2);

                expect(entries[0].target).toBe(elements.target1);
                expect(entries[1].target).toBe(elements.target2);
            }).then(async () => {
                observer.unobserve(elements.target1);

                elements.target1.style.width = '50px';
                elements.target2.style.width = '50px';

                const entries = await spy.nextCall();

                expect(spy).toHaveBeenCalledTimes(2);

                expect(entries.length).toBe(1);
                expect(entries[0].target).toBe(elements.target2);
                expect(entries[0].contentRect.width).toBe(50);
            }).then(async () => {
                elements.target2.style.width = '100px';

                observer.unobserve(elements.target2);

                await wait(timeout);

                expect(spy).toHaveBeenCalledTimes(2);
            }).then(done).catch(done.fail);
        });

        it('doesn\'t prevent gathered observations from being notified', done => {
            const spy = createAsyncSpy();
            const spy2 = createAsyncSpy();

            let shouldUnobserve = false;

            observer = new ResizeObserver(() => {
                spy(...arguments);

                if (shouldUnobserve) {
                    observer2.unobserve(elements.target1);
                }
            });

            observer2 = new ResizeObserver(() => {
                spy2(...arguments);

                if (shouldUnobserve) {
                    observer.unobserve(elements.target1);
                }
            });

            observer.observe(elements.target1);
            observer2.observe(elements.target1);

            Promise.all([
                spy.nextCall(),
                spy2.nextCall()
            ]).then(() => {
                shouldUnobserve = true;

                elements.target1.style.width = '220px';

                return Promise.all([spy.nextCall(), spy2.nextCall()]);
            }).then(done).catch(done.fail);
        });

        it('handles elements that are not observed', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            observer.unobserve(elements.target1);

            wait(timeout).then(() => {
                expect(spy).not.toHaveBeenCalled();
            }).then(done).catch(done.fail);
        });
    });

    describe('disconnect', () => {
        it('stops observing all elements', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);
            observer.observe(elements.target2);

            spy.nextCall().then(entries => {
                expect(entries.length).toBe(2);

                expect(entries[0].target).toBe(elements.target1);
                expect(entries[1].target).toBe(elements.target2);
            }).then(async () => {
                elements.target1.style.width = '600px';
                elements.target2.style.width = '600px';

                observer.disconnect();

                await wait(timeout);

                expect(spy).toHaveBeenCalledTimes(1);
            }).then(done).catch(done.fail);
        });

        it('prevents gathered observations from being notified', done => {
            const spy = createAsyncSpy();
            const spy2 = createAsyncSpy();

            let shouldDisconnect = false;

            observer = new ResizeObserver(() => {
                spy(...arguments);

                if (shouldDisconnect) {
                    observer2.disconnect();
                }
            });

            observer2 = new ResizeObserver(() => {
                spy2(...arguments);

                if (shouldDisconnect) {
                    observer.disconnect();
                }
            });

            observer.observe(elements.target1);
            observer2.observe(elements.target1);

            Promise.all([
                spy.nextCall(),
                spy2.nextCall()
            ]).then(async () => {
                shouldDisconnect = true;

                elements.target1.style.width = '220px';

                await Promise.race([spy.nextCall(), spy2.nextCall()]);
                await wait(10);

                if (spy.calls.count() === 2) {
                    expect(spy2).toHaveBeenCalledTimes(1);
                }

                if (spy2.calls.count() === 2) {
                    expect(spy).toHaveBeenCalledTimes(1);
                }
            }).then(done).catch(done.fail);
        });

        it('doesn\'t destroy observer', done => {
            const spy = createAsyncSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            spy.nextCall().then(async () => {
                elements.target1.style.width = '600px';

                observer.disconnect();

                await wait(timeout);

                observer.observe(elements.target1);

                const entries = await spy.nextCall();

                expect(spy).toHaveBeenCalledTimes(2);

                expect(entries.length).toBe(1);

                expect(entries[0].target).toBe(elements.target1);
                expect(entries[0].contentRect.width).toBe(600);
            }).then(done).catch(done.fail);
        });
    });
});
