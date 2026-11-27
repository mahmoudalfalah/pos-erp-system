import { fail, ok } from '@/types/result.type';

import { validateCreateBrandInput, type CreateBrandInput } from './create-brand.validator';

const validInput: CreateBrandInput = {
    name: 'Apple',
    slug: 'apple',
    description: 'Consumer electronics brand',
    isActive: true,
};

describe('validateCreateBrandInput', () => {
    it('accepts valid complete input', () => {
        const result = validateCreateBrandInput(validInput);
        expect(result).toStrictEqual(ok(validInput));
    });

    it('trims whitespace from string fields', () => {
        const result = validateCreateBrandInput({
            ...validInput,
            name: '  Apple  ',
            slug: '  apple  ',
            description: '  Consumer electronics brand  ',
        });
        expect(result).toStrictEqual(ok(validInput));
    });

    it('defaults isActive to true when omitted', () => {
        const result = validateCreateBrandInput({
            name: validInput.name,
            slug: validInput.slug,
            description: validInput.description,
        });
        expect(result).toStrictEqual(ok(validInput));
    });

    it('preserves explicit isActive value', () => {
        const result = validateCreateBrandInput({
            ...validInput,
            isActive: false,
        });
        expect(result).toStrictEqual(
            ok({
                ...validInput,
                isActive: false,
            }),
        );
    });

    it('accepts valid input when optional description is omitted', () => {
        const { description: _description, ...rest } = validInput;
        const result = validateCreateBrandInput(rest);
        expect(result).toStrictEqual(ok(rest));
    });

    it('normalizes an empty description to undefined', () => {
        const result = validateCreateBrandInput({
            ...validInput,
            description: '',
        });
        expect(result).toStrictEqual(
            ok({
                ...validInput,
                description: undefined,
            }),
        );
    });

    it('normalizes a whitespace-only description to undefined', () => {
        const result = validateCreateBrandInput({
            ...validInput,
            description: '   ',
        });
        expect(result).toStrictEqual(
            ok({
                ...validInput,
                description: undefined,
            }),
        );
    });

    it('accepts values at the maximum allowed lengths', () => {
        const maxLengthInput: CreateBrandInput = {
            name: 'A'.repeat(40),
            slug: 'a'.repeat(40),
            description: 'A'.repeat(255),
            isActive: true,
        };

        const result = validateCreateBrandInput(maxLengthInput);
        expect(result).toStrictEqual(ok(maxLengthInput));
    });

    it.each([
        {
            case: 'an empty name',
            field: 'name',
            overrides: { name: '' },
            messages: ['Brand name is required'],
        },
        {
            case: 'a whitespace-only name',
            field: 'name',
            overrides: { name: '   ' },
            messages: ['Brand name is required'],
        },
        {
            case: 'a name longer than 40 characters',
            field: 'name',
            overrides: { name: 'A'.repeat(41) },
            messages: ['Brand name must be at most 40 characters long'],
        },
        {
            case: 'an empty slug',
            field: 'slug',
            overrides: { slug: '' },
            messages: [
                'Brand slug is required',
                'Brand slug must be URL-friendly (lowercase letters, numbers, and hyphens only)',
            ],
        },
        {
            case: 'a whitespace-only slug',
            field: 'slug',
            overrides: { slug: '   ' },
            messages: [
                'Brand slug is required',
                'Brand slug must be URL-friendly (lowercase letters, numbers, and hyphens only)',
            ],
        },
        {
            case: 'a slug longer than 40 characters',
            field: 'slug',
            overrides: { slug: 'a'.repeat(41) },
            messages: ['Brand slug must be at most 40 characters long'],
        },
        {
            case: 'an invalid slug',
            field: 'slug',
            overrides: { slug: 'Invalid Slug!' },
            messages: [
                'Brand slug must be URL-friendly (lowercase letters, numbers, and hyphens only)',
            ],
        },
        {
            case: 'a description longer than 255 characters',
            field: 'description',
            overrides: { description: 'A'.repeat(256) },
            messages: ['Brand description must be at most 255 characters long'],
        },
    ])('rejects $case', ({ overrides, field, messages }) => {
        const result = validateCreateBrandInput({
            ...validInput,
            ...overrides,
        });
        expect(result).toStrictEqual(
            fail({
                code: 'VALIDATION',
                message: 'Invalid input data',
                fields: {
                    [field]: messages,
                },
            }),
        );
    });
});
