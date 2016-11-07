import ResizeObserver from './index';

declare global {
    var ResizeObserver: {
        prototype: ResizeObserver;
        new(callback: ResizeObserverCallback): ResizeObserver;
        continuousUpdates?: boolean
    }
}

export default ResizeObserver;
