import ContentRect from '../src/ContentRect';

const properties = [
    'width',
    'height',
    'left',
    'top'
];

describe('ContentRect', () => {
    describe('constructor', () => {
        it('creates new ContentRect', () => {
            const contentRect = new ContentRect(10, 20, 30, 40);

            expect(contentRect.width).toEqual(10);
            expect(contentRect.height).toEqual(20);
            expect(contentRect.top).toEqual(30);
            expect(contentRect.left).toEqual(40);
        });

        it('has no enumerable properties', () => {
            const contentRect = new ContentRect(0, 0, 0, 0);
            const keys = Object.keys(contentRect);

            expect(keys.length).toEqual(0);
        });

        it('properties are not configurable', () => {
            const contentRect = new ContentRect(0, 0, 0, 0);

            for (const key of properties) {
                const descriptor = Object.getOwnPropertyDescriptor(contentRect, key);

                expect(descriptor.configurable).toBe(false);
            }
        });

        it('properties are not writable', () => {
            const contentRect = new ContentRect(0, 0, 0, 0);

            for (const key of properties) {
                const descriptor = Object.getOwnPropertyDescriptor(contentRect, key);

                expect(descriptor.writable).toBe(false);
            }
        });
    });
});
