import { emptyToUndefined } from './zod.util';

describe('Zod Util', () => {
    describe('emptyToUndefined', () => {
        it('returns undefined for empty string', () => {
            expect(emptyToUndefined.parse('')).toBeUndefined();
        });
        it('returns undefined for string with only whitespace', () => {
            expect(emptyToUndefined.parse(' ')).toBeUndefined();
        });
        it('returns the same value for non-empty string', () => {
            expect(emptyToUndefined.parse('test')).toBe('test');
        });
        it('trims and return a valid string for non emtpy strings', () => {
            expect(emptyToUndefined.parse('  test  ')).toBe('test');
        });
    });
});
