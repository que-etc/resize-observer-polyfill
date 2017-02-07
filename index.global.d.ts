import ResizeObserver from './index';

declare global {
    var ResizeObserver: {
        prototype: ResizeObserver;
        new(callback: ResizeObserverCallback): ResizeObserver;
    }
}

export default ResizeObserver;
