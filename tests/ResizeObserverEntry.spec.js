import ResizeObserverEntry from '../src/ResizeObserverEntry';

const properties = [
    'target',
    'contentRect'
];

const rectData = {
    width: 10,
    height: 20,
    top: 8,
    right: 25,
    bottom: 28,
    left: 15
};

describe('ResizeObserverEntry', () => {
    describe('constructor', () => {
        it('creates new ResizeObserverEntry', () => {
            const target = document.body;
            const keys = Object.keys(rectData);
            const entry = new ResizeObserverEntry(target, rectData);

            expect(entry.target).toBe(target);

            for (const key of keys) {
                const descriptor = Object.getOwnPropertyDescriptor(entry.contentRect, key);

                expect(entry.contentRect[key]).toEqual(rectData[key]);

                expect(descriptor.writable).toBe(false);
                expect(descriptor.enumerable).toBe(false);
                expect(descriptor.configurable).toBe(false);
            }
        });

        it('has no enumerable properties', () => {
            const target = document.body;
            const entry = new ResizeObserverEntry(target, rectData);
            const keys = Object.keys(entry);

            expect(keys.length).toEqual(0);
        });

        it('properties are not configurable', () => {
            const target = document.body;
            const entry = new ResizeObserverEntry(target, rectData);

            for (const key of properties) {
                const descriptor = Object.getOwnPropertyDescriptor(entry, key);

                expect(descriptor.configurable).toBe(false);
            }
        });

        it('properties are not writable', () => {
            const target = document.body;
            const entry = new ResizeObserverEntry(target, rectData);

            for (const key of properties) {
                const descriptor = Object.getOwnPropertyDescriptor(entry, key);

                expect(descriptor.writable).toBe(false);
            }
        });
    });
});
