import { fail, ok } from '@/types/result.type';

import { validateUpdateCategoryInput } from './update-category.validator';

const validInput = {
    name: 'Electronics',
    slug: 'electronics',
    description: 'All kinds of electronic items',
    isActive: true,
};

describe('validateUpdateCategoryInput', () => {
    it('trims input', () => {
        const result = validateUpdateCategoryInput({
            name: '  Electronics  ',
            slug: '  electronics  ',
            description: '  All kinds of electronic items  ',
            isActive: true,
        });
        expect(result).toStrictEqual(ok(validInput));
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
        {
            case: 'missing status',
            overrides: { isActive: undefined },
            field: 'isActive',
            message: 'status is required',
        },
    ])('rejects %case', ({ overrides, field, message }) => {
        const result = validateUpdateCategoryInput({
            ...validInput,
            ...overrides,
        });
        expect(result).toStrictEqual(
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

        const result = validateUpdateCategoryInput(input);
        expect(result).toStrictEqual(ok(input));
    });
});
