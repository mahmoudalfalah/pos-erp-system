import { mergeRefs } from './merge-refs.util';

describe('mergeRefs', () => {
    const mockNode = {} as HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should correctly assign the node to an object ref', () => {
        const objectRef = { current: null };
        const merged = mergeRefs<HTMLElement>(objectRef);
        merged(mockNode);

        expect(objectRef.current).toBe(mockNode);
    });

    it('should correctly execute a callback ref with the node', () => {
        const callbackRef = vi.fn();
        const merged = mergeRefs<HTMLElement>(callbackRef);
        merged(mockNode);
        expect(callbackRef).toHaveBeenCalledWith(mockNode);
    });

    it('should merge multiple refs of different types simultaneously', () => {
        const objectRef = { current: null };
        const callbackRef = vi.fn();
        const merged = mergeRefs<HTMLElement>(objectRef, callbackRef);
        merged(mockNode);
        expect(objectRef.current).toBe(mockNode);
        expect(callbackRef).toHaveBeenCalledWith(mockNode);
    });

    it('should safely ignore null and undefined refs', () => {
        const objectRef = { current: null };
        const merged = mergeRefs<HTMLElement>(objectRef, null, undefined);
        expect(() => merged(mockNode)).not.toThrow();
        expect(objectRef.current).toBe(mockNode);
    });

    it('should handle React unmounting by passing null to all refs', () => {
        const objectRef = { current: mockNode };
        const callbackRef = vi.fn();

        const merged = mergeRefs<HTMLElement>(objectRef, callbackRef);
        merged(null);

        expect(objectRef.current).toBe(null);
        expect(callbackRef).toHaveBeenCalledWith(null);
    });
});
