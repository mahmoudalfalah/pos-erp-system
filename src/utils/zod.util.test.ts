import { z } from 'zod';

import { emptyToUndefined, getBaseSchema, getFieldConstraints, isFieldRequired } from './zod.util';

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
    describe('getBaseSchema', () => {
        it('should return the schema as-is for base types', () => {
            expect(getBaseSchema(z.string())).toBeInstanceOf(z.ZodString);
        });
        it('should unwrap a single modifier (optional)', () => {
            expect(getBaseSchema(z.string().optional())).toBeInstanceOf(z.ZodString);
        });
        it('should unwrap a single modifier (nullable)', () => {
            expect(getBaseSchema(z.string().nullable())).toBeInstanceOf(z.ZodString);
        });
        it('should unwrap a single modifier (default)', () => {
            expect(getBaseSchema(z.string().default('test'))).toBeInstanceOf(z.ZodString);
        });
        it('should unwrap deeply nested modifiers (optional, nullable, default)', () => {
            expect(getBaseSchema(z.string().default('test').nullable().optional())).toBeInstanceOf(
                z.ZodString,
            );
        });
    });
    describe('isFieldRequired', () => {
        it('should return true for a standard required schema', () => {
            expect(isFieldRequired(z.string())).toBe(true);
        });
        it('should return false for optional', () => {
            expect(isFieldRequired(z.string().optional())).toBe(false);
        });
        it('should return false for nullable', () => {
            expect(isFieldRequired(z.string().nullable())).toBe(false);
        });
        it('should return false for default', () => {
            expect(isFieldRequired(z.string().default('test'))).toBe(false);
        });
        it('should analyze pipeline schemas correctly (both required)', () => {
            const pipeSchema = z.string().pipe(z.string().min(3));
            expect(isFieldRequired(pipeSchema)).toBe(true);
        });
        it('should analyze pipeline schemas correctly (input optional)', () => {
            const pipeSchema = z.string().optional().pipe(z.string().min(3));
            expect(isFieldRequired(pipeSchema)).toBe(false);
        });
        it('should analyze pipeline schemas correctly (output optional)', () => {
            const pipeSchema = z
                .string()
                .transform((val): string | undefined => val)
                .pipe(z.string().optional());
            expect(isFieldRequired(pipeSchema)).toBe(false);
        });
    });
    describe('getFieldConstraints', () => {
        it('should return an empty object if there are no constraints', () => {
            expect(getFieldConstraints(z.string())).toStrictEqual({});
        });
        it('should return the maxLength constraint for a string', () => {
            expect(getFieldConstraints(z.string().max(100))).toStrictEqual({ maxLength: '100' });
        });
    });
});
