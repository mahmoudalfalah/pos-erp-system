import { fail, ok } from '@/types/result.type';

import { validateCreateCategoryInput } from './create-category.validator';

const validInput = {
    name: 'Electronics',
    slug: 'electronics',
    description: 'All kinds of electronic items',
    isActive: true,
};

describe('validateCreateCategoryInput', () => {
    it('trims input and defaults isActive to true', () => {
        const result = validateCreateCategoryInput({
            name: '  Electronics  ',
            slug: '  electronics  ',
            description: '  All kinds of electronic items  ',
        });
        expect(result).toEqual(ok(validInput));
    });
    it('preserves explicit isActive value', () => {
        const result = validateCreateCategoryInput({
            ...validInput,
            isActive: false,
        });
        expect(result).toEqual(
            ok({
                ...validInput,
                isActive: false,
            }),
        );
    });

    it.each([
        {
            case: 'an empty name',
            field: 'name',
            overrides: { name: '' },
            message: 'Category name is required',
        },
        {
            case: 'a name longer than 40 characters',
            overrides: { name: 'A'.repeat(41) },
            field: 'name',
            message: 'Category name must be at most 40 characters long',
        },
        {
            case: 'an invalid slug',
            overrides: { slug: 'Invalid Slug!' },
            field: 'slug',
            message:
                'Category slug must be URL-friendly (lowercase letters, numbers, and hyphens only)',
        },
        {
            case: 'a description longer than 255 characters',
            overrides: { description: 'A'.repeat(256) },
            field: 'description',
            message: 'Category description must be at most 255 characters long',
        },
    ])('rejects %case', ({ overrides, field, message }) => {
        const result = validateCreateCategoryInput({
            ...validInput,
            ...overrides,
        });
        expect(result).toEqual(
            fail({
                code: 'VALIDATION',
                message: 'Invalid input data',
                fields: {
                    [field]: [message],
                },
            }),
        );
    });

    it('accepts values at the maximum allowed lengths', () => {
        const input = {
            ...validInput,
            name: 'A'.repeat(40),
            description: 'A'.repeat(200),
        };

        const result = validateCreateCategoryInput(input);
        expect(result).toEqual(ok(input));
    });
});
