import ResizeObserverEntry from '../src/ResizeObserverEntry';
import ContentRect from '../src/ContentRect';

const properties = [
    'target',
    'contentRect'
];

describe('ResizeObserverEntry', () => {
    describe('constructor', () => {
        it('creates new ResizeObserverEntry', () => {
            const target = document.body;
            const entry = new ResizeObserverEntry(target, 10, 20, 30, 40);

            expect(entry.target).toBe(target);
            expect(entry.contentRect instanceof ContentRect).toBe(true);
        });

        it('has no enumerable properties', () => {
            const target = document.body;
            const entry = new ResizeObserverEntry(target, 10, 20, 30, 40);
            const keys = Object.keys(entry);

            expect(keys.length).toEqual(0);
        });

        it('properties are not configurable', () => {
            const target = document.body;
            const entry = new ResizeObserverEntry(target, 10, 20, 30, 40);

            for (const key of properties) {
                const descriptor = Object.getOwnPropertyDescriptor(entry, key);

                expect(descriptor.configurable).toBe(false);
            }
        });

        it('properties are not writable', () => {
            const target = document.body;
            const entry = new ResizeObserverEntry(target, 10, 20, 30, 40);

            for (const key of properties) {
                const descriptor = Object.getOwnPropertyDescriptor(entry, key);

                expect(descriptor.writable).toBe(false);
            }
        });
    });
});