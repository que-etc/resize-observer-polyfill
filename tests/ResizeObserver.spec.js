import ResizeObserver from '../src/ResizeObserver';
import ResizeObserverEntry from '../src/ResizeObserverEntry';

/* eslint-disable max-nested-callbacks, no-shadow, no-new, no-empty-function, require-jsdoc */

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
        background: #fbbc05;
    }

    #target1.animate {
        animation-duration: 0.5s;
        animation-name: animateWidth;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }

    #target2 {
        background: #4285f4;
    }

    @keyframes animateWidth {
        from {
            width: 200px;
        }

        to {
            width: 700px;
        }
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

const timeout = 250;
const defaultIdleTimeout = ResizeObserver.idleTimeout;

let styles,
    observer = null,
    elements = {};

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

function runSequence(callbacks, done) {
    const next = callbacks.shift();

    if (next) {
        next(() => runSequence(callbacks, done));
    } else if (done) {
        done();
    }
}

describe('ResizeObserver', () => {
    beforeEach(() => {
        appendStyles();
        appendElements();
    });

    afterEach(() => {
        if (observer) {
            observer.disconnect();
        }

        ResizeObserver.idleTimeout = defaultIdleTimeout;

        observer = null;

        removeStyles();
        removeElements();
    });

    describe('constructor', () => {
        it('throws an error if no arguments were provided', () => {
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
        });
    });

    describe('observe', () => {
        it('throws an error if no arguments have been provided', () => {
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

                /* eslint-disable no-invalid-this */
                expect(this).toBe(observer);

                /* eslint-enable no-invalid-this */

                done();
            });

            observer.observe(elements.target1);
        });

        it('handles already observed elements', done => {
            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target1);

                    done();
                }, timeout);
            }, done => {
                observer.observe(elements.target1);

                setTimeout(() => {
                    expect(spy).toHaveBeenCalledTimes(1);

                    done();
                }, timeout);
            }], done);
        });

        it('handles elements that are not yet in the DOM', done => {
            elements.root.removeChild(elements.container);
            elements.container.removeChild(elements.target1);

            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            runSequence([done => {
                setTimeout(() => {
                    expect(spy).not.toHaveBeenCalled();

                    done();
                }, timeout);
            }, done => {
                elements.container.appendChild(elements.target1);

                setTimeout(() => {
                    expect(spy).not.toHaveBeenCalled();

                    done();
                }, timeout);
            }, done => {
                elements.root.appendChild(elements.container);

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);

                    done();
                }, timeout);
            }], done);
        });

        it('triggers when element is removed from DOM', done => {
            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);
            observer.observe(elements.target2);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(2);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[1].target).toBe(elements.target2);

                    done();
                }, timeout);
            }, done => {
                elements.container.removeChild(elements.target1);

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(2);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(0);
                    expect(entries[0].contentRect.height).toBe(0);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(0);
                    expect(entries[0].contentRect.bottom).toBe(0);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }, done => {
                elements.root.removeChild(elements.container);

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(3);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target2);

                    expect(entries[0].contentRect.width).toBe(0);
                    expect(entries[0].contentRect.height).toBe(0);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(0);
                    expect(entries[0].contentRect.bottom).toBe(0);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }], done);
        });

        it('handles hidden elements', done => {
            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            elements.root.style.display = 'none';
            elements.target1.style.display = 'none';

            observer.observe(elements.target1);

            runSequence([done => {
                setTimeout(() => {
                    expect(spy).not.toHaveBeenCalled();

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.display = 'block';

                setTimeout(() => {
                    expect(spy).not.toHaveBeenCalled();

                    done();
                }, timeout);
            }, done => {
                elements.root.style.display = 'block';
                elements.target1.style.position = 'fixed';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(200);
                    expect(entries[0].contentRect.bottom).toBe(200);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }, done => {
                elements.root.style.display = 'none';
                elements.target1.style.padding = '10px';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(2);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(0);
                    expect(entries[0].contentRect.height).toBe(0);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(0);
                    expect(entries[0].contentRect.bottom).toBe(0);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }], done);
        });

        it('handles paddings', done => {
            const spy = jasmine.createSpy();

            elements.target1.style.padding = '2px 4px 6px 8px';

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(2);
                    expect(entries[0].contentRect.right).toBe(208);
                    expect(entries[0].contentRect.bottom).toBe(202);
                    expect(entries[0].contentRect.left).toBe(8);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.padding = '3px 6px';

                setTimeout(() => {
                    expect(spy).toHaveBeenCalledTimes(1);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.boxSizing = 'border-box';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(2);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(188);
                    expect(entries[0].contentRect.height).toBe(194);
                    expect(entries[0].contentRect.top).toBe(3);
                    expect(entries[0].contentRect.right).toBe(194);
                    expect(entries[0].contentRect.bottom).toBe(197);
                    expect(entries[0].contentRect.left).toBe(6);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.padding = '0px 6px';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(3);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(188);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(194);
                    expect(entries[0].contentRect.bottom).toBe(200);
                    expect(entries[0].contentRect.left).toBe(6);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.padding = '0px';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(4);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(200);
                    expect(entries[0].contentRect.bottom).toBe(200);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }], done);
        });

        it('handles borders', done => {
            const spy = jasmine.createSpy();

            elements.target1.style.border = '10px solid black';

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(200);
                    expect(entries[0].contentRect.bottom).toBe(200);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.border = '5px solid black';

                setTimeout(() => {
                    expect(spy).toHaveBeenCalledTimes(1);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.boxSizing = 'border-box';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(2);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(190);
                    expect(entries[0].contentRect.height).toBe(190);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(190);
                    expect(entries[0].contentRect.bottom).toBe(190);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.borderTop = '';
                elements.target1.style.borderBottom = '';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(3);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(190);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(190);
                    expect(entries[0].contentRect.bottom).toBe(200);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.borderLeft = '';
                elements.target1.style.borderRight = '';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(4);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(200);
                    expect(entries[0].contentRect.bottom).toBe(200);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }], done);
        });

        it('handles scrollbars size', done => {
            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            elements.root.style.width = '100px';
            elements.root.style.height = '250px';
            elements.root.style.overflow = 'auto';

            elements.container.style.minWidth = '0px';

            observer.observe(elements.root);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.root);

                    expect(entries[0].contentRect.width).toBe(elements.root.clientWidth);
                    expect(entries[0].contentRect.height).toBe(elements.root.clientHeight);

                    done();
                }, timeout);
            }, done => {
                const width = elements.root.clientWidth;

                elements.target1.style.width = width + 'px';
                elements.target2.style.width = width + 'px';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(2);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.root);

                    expect(entries[0].contentRect.height).toBe(250);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.height = '125px';
                elements.target2.style.height = '125px';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(3);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.root);

                    expect(entries[0].contentRect.width).toBe(100);

                    done();
                }, timeout);
            }], done);
        });

        it('handles empty elements', done => {
            const spy = jasmine.createSpy();

            elements.target1.style.width = '0px';
            elements.target1.style.height = '0px';
            elements.target1.style.padding = '10px';

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);
            observer.observe(elements.target2);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target2);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(200);
                    expect(entries[0].contentRect.bottom).toBe(200);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.width = '200px';
                elements.target1.style.height = '200px';

                elements.target2.style.width = '0px';
                elements.target2.style.height = '0px';
                elements.target2.padding = '10px';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(2);

                    expect(entries.length).toBe(2);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[1].target).toBe(elements.target2);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);

                    expect(entries[1].contentRect.width).toBe(0);
                    expect(entries[1].contentRect.height).toBe(0);
                    expect(entries[1].contentRect.top).toBe(0);
                    expect(entries[1].contentRect.right).toBe(0);
                    expect(entries[1].contentRect.bottom).toBe(0);
                    expect(entries[1].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }], done);
        });

        it('handles inline elements', done => {
            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            elements.target1.style.display = 'inline';
            elements.target1.style.padding = '10px';

            observer.observe(elements.target1);

            runSequence([done => {
                setTimeout(() => {
                    expect(spy).not.toHaveBeenCalled();

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.position = 'absolute';

                setTimeout(() => {
                    expect(spy).toHaveBeenCalledTimes(1);

                    const entries = spy.calls.mostRecent().args[0];

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(10);
                    expect(entries[0].contentRect.left).toBe(10);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.position = 'static';

                setTimeout(() => {
                    expect(spy).toHaveBeenCalledTimes(2);

                    const entries = spy.calls.mostRecent().args[0];

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target1);

                    expect(entries[0].contentRect.width).toBe(0);
                    expect(entries[0].contentRect.height).toBe(0);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(0);
                    expect(entries[0].contentRect.bottom).toBe(0);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }], done);
        });

        it('handles svg elements', done => {
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

            const spy = jasmine.createSpy();
            const svgRoot = document.getElementById('svg-root');
            const svgRect = document.getElementById('svg-rect');

            observer = new ResizeObserver(spy);

            observer.observe(svgRect);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(svgRect);

                    expect(entries[0].contentRect.width).toBe(200);
                    expect(entries[0].contentRect.height).toBe(150);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(200);
                    expect(entries[0].contentRect.bottom).toBe(150);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }, done => {
                svgRect.setAttribute('width', 250);
                svgRect.setAttribute('height', 200);

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(2);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(svgRect);

                    expect(entries[0].contentRect.width).toBe(250);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(250);
                    expect(entries[0].contentRect.bottom).toBe(200);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }, done => {
                observer.observe(svgRoot);

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(3);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(svgRoot);

                    expect(entries[0].contentRect.width).toBe(250);
                    expect(entries[0].contentRect.height).toBe(200);
                    expect(entries[0].contentRect.top).toBe(0);
                    expect(entries[0].contentRect.right).toBe(250);
                    expect(entries[0].contentRect.bottom).toBe(200);
                    expect(entries[0].contentRect.left).toBe(0);

                    done();
                }, timeout);
            }], done);
        });

        if (typeof document.body.style.transform !== 'undefined') {
            it('handles transformations', done => {
                const spy = jasmine.createSpy();

                observer = new ResizeObserver(spy);

                observer.observe(elements.target1);

                runSequence([done => {
                    setTimeout(() => {
                        const entries = spy.calls.mostRecent().args[0];

                        expect(spy).toHaveBeenCalledTimes(1);

                        expect(entries.length).toBe(1);
                        expect(entries[0].target).toBe(elements.target1);

                        expect(entries[0].contentRect.width).toBe(200);
                        expect(entries[0].contentRect.height).toBe(200);
                        expect(entries[0].contentRect.top).toBe(0);
                        expect(entries[0].contentRect.left).toBe(0);

                        done();
                    }, timeout);
                }, done => {
                    elements.target1.style.transform = 'scale(0.5)';
                    elements.target2.style.transform = 'scale(0.5)';

                    observer.observe(elements.target2);

                    setTimeout(() => {
                        const entries = spy.calls.mostRecent().args[0];

                        expect(spy).toHaveBeenCalledTimes(2);

                        expect(entries.length).toBe(1);
                        expect(entries[0].target).toBe(elements.target2);

                        expect(entries[0].contentRect.width).toBe(200);
                        expect(entries[0].contentRect.height).toBe(200);
                        expect(entries[0].contentRect.top).toBe(0);
                        expect(entries[0].contentRect.left).toBe(0);

                        done();
                    }, timeout);
                }, done => {
                    elements.target1.style.transform = '';
                    elements.target2.style.transform = '';

                    setTimeout(() => {
                        expect(spy).toHaveBeenCalledTimes(2);

                        done();
                    }, timeout);
                }], done);
            });
        }

        if (typeof document.body.style.transition !== 'undefined') {
            it('handles transitions', done => {
                const spy = jasmine.createSpy();

                elements.target1.style.transition = 'width 1s, height 0.5s';

                observer = new ResizeObserver(spy);

                observer.observe(elements.target1);

                runSequence([done => {
                    setTimeout(() => {
                        const entries = spy.calls.mostRecent().args[0];

                        expect(spy).toHaveBeenCalledTimes(1);

                        expect(entries[0].target).toBe(elements.target1);
                        expect(entries[0].contentRect.width).toBe(200);
                        expect(entries[0].contentRect.height).toBe(200);

                        done();
                    }, timeout);
                }, done => {
                    elements.target1.style.width = '600px';
                    elements.target1.style.height = '350px';

                    setTimeout(() => {
                        const entries = spy.calls.mostRecent().args[0];

                        expect(spy.calls.count()).toBeGreaterThan(2);

                        expect(entries[0].target).toBe(elements.target1);
                        expect(entries[0].contentRect.width).toBe(600);
                        expect(entries[0].contentRect.height).toBe(350);

                        done();
                    }, 1100);
                }], done);
            });

            it('handles changes caused by delayed transitions in nearby or descendant elements', done => {
                const spy = jasmine.createSpy();

                elements.container.style.minHeight = '600px';
                elements.target1.style.transition = 'width 0.5s, height 0.5s';
                elements.target2.style.transition = 'width 0.5s, height 0.5s';

                ResizeObserver.idleTimeout = 500;

                observer = new ResizeObserver(spy);

                observer.observe(elements.container);

                runSequence([done => {
                    setTimeout(() => {
                        const entries = spy.calls.mostRecent().args[0];

                        expect(spy).toHaveBeenCalledTimes(1);

                        expect(entries[0].target).toBe(elements.container);
                        expect(entries[0].contentRect.width).toBe(600);
                        expect(entries[0].contentRect.height).toBe(600);

                        done();
                    }, timeout);
                }, done => {
                    elements.target1.style.width = '700px';
                    elements.target1.style.height = '350px';

                    elements.target2.style.width = '700px';
                    elements.target2.style.height = '350px';

                    setTimeout(() => {
                        const entries = spy.calls.mostRecent().args[0];

                        expect(spy.calls.count()).toBeGreaterThan(2);

                        expect(entries[0].target).toBe(elements.container);
                        expect(entries[0].contentRect.width).toBe(700);
                        expect(entries[0].contentRect.height).toBe(700);

                        done();
                    }, 540);
                }], done);
            });
        }

        if (typeof document.body.style.animation !== 'undefined') {
            it('handles long-running/infinite animations', done => {
                const spy = jasmine.createSpy();

                observer = new ResizeObserver(spy);

                observer.observe(elements.container);

                ResizeObserver.idleTimeout = 550;

                runSequence([done => {
                    setTimeout(() => {
                        const entries = spy.calls.mostRecent().args[0];

                        expect(spy).toHaveBeenCalledTimes(1);

                        expect(entries[0].target).toBe(elements.container);
                        expect(entries[0].contentRect.width).toBe(600);

                        done();
                    }, timeout);
                }, done => {
                    setTimeout(() => {
                        elements.target1.className = 'animate';
                    }, 540);

                    setTimeout(() => {
                        const entries = spy.calls.mostRecent().args[0];

                        expect(spy.calls.count()).toBeGreaterThan(2);

                        expect(entries[0].target).toBe(elements.container);
                        expect(entries[0].contentRect.width).toBe(elements.container.clientWidth);

                        done();
                    }, 8600);
                }], done);
            }, 9200);
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
            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);
            observer.observe(elements.target2);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(2);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[1].target).toBe(elements.target2);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.width = '600px';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(2);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].contentRect.width).toBe(600);

                    done();
                }, timeout);
            }, done => {
                observer.unobserve(elements.target1);

                elements.target1.style.width = '50px';
                elements.target2.style.width = '50px';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(3);

                    expect(entries.length).toBe(1);
                    expect(entries[0].target).toBe(elements.target2);
                    expect(entries[0].contentRect.width).toBe(50);

                    done();
                }, timeout);
            }], done);
        });

        it('handles elements that are not observed', done => {
            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            observer.unobserve(elements.target1);

            setTimeout(() => {
                expect(spy).not.toHaveBeenCalled();

                done();
            }, timeout);
        });
    });

    describe('disconnect', () => {
        it('stops observing all elements', done => {
            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);
            observer.observe(elements.target2);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);

                    expect(entries.length).toBe(2);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[1].target).toBe(elements.target2);

                    done();
                }, timeout);
            }, done => {
                observer.disconnect();

                elements.target1.style.width = '600px';
                elements.target2.style.width = '600px';

                observer.disconnect();

                setTimeout(() => {
                    expect(spy).toHaveBeenCalledTimes(1);

                    done();
                }, timeout);
            }], done);
        });

        it('can resume observations', done => {
            const spy = jasmine.createSpy();

            observer = new ResizeObserver(spy);

            observer.observe(elements.target1);
            observer.observe(elements.target2);

            runSequence([done => {
                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(entries.length).toBe(2);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.width = '600px';
                elements.target2.style.width = '600px';

                observer.disconnect();

                setTimeout(() => {
                    expect(spy).toHaveBeenCalledTimes(1);

                    done();
                }, timeout);
            }, done => {
                observer.observe(elements.target1);

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(2);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].contentRect.width).toBe(600);

                    done();
                }, timeout);
            }, done => {
                elements.target1.style.width = '200px';

                setTimeout(() => {
                    const entries = spy.calls.mostRecent().args[0];

                    expect(spy).toHaveBeenCalledTimes(3);

                    expect(entries.length).toBe(1);

                    expect(entries[0].target).toBe(elements.target1);
                    expect(entries[0].contentRect.width).toBe(200);

                    done();
                }, timeout);
            }], done);
        });
    });
});
