import { fail, ok } from '@/types/result.type';

import { validateCategoryListingParamsSchema } from './category-listing.validator';

const validInput = {
    search: 'electronics',
    page: 2,
    perPage: 50,
    status: 'active',
    sortBy: 'name',
    sortOrder: 'asc',
};

describe('validateCategoryListingParamsSchema', () => {
    it('applies defaults when no parameters are provided', () => {
        const result = validateCategoryListingParamsSchema({});

        expect(result).toEqual(
            ok({
                search: undefined,
                page: 1,
                perPage: 20,
                status: 'all',
                sortBy: 'createdAt',
                sortOrder: 'desc',
            }),
        );
    });

    it('preserves explicitly provided valid parameters', () => {
        const result = validateCategoryListingParamsSchema(validInput);

        expect(result).toEqual(ok(validInput));
    });

    it.each([
        {
            field: 'page',
            input: '2',
            expected: 2,
        },
        {
            field: 'perPage',
            input: '50',
            expected: 50,
        },
    ] as const)('coerces $field from a numeric string', ({ field, input, expected }) => {
        const result = validateCategoryListingParamsSchema({
            ...validInput,
            [field]: input,
        });

        expect(result).toEqual(
            ok({
                ...validInput,
                [field]: expected,
            }),
        );
    });

    it.each([
        {
            case: 'trims surrounding whitespace',
            input: '   electronics   ',
            expected: 'electronics',
        },
        {
            case: 'normalizes a blank value to undefined',
            input: '   ',
            expected: undefined,
        },
        {
            case: 'preserves exactly 100 characters',
            input: 'a'.repeat(100),
            expected: 'a'.repeat(100),
        },
    ])('$case for search', ({ input, expected }) => {
        const result = validateCategoryListingParamsSchema({
            ...validInput,
            search: input,
        });

        expect(result).toEqual(
            ok({
                ...validInput,
                search: expected,
            }),
        );
    });

    it('preserves a perPage value of 100', () => {
        const result = validateCategoryListingParamsSchema({
            ...validInput,
            perPage: 100,
        });

        expect(result).toEqual(
            ok({
                ...validInput,
                perPage: 100,
            }),
        );
    });

    describe.each([
        { field: 'page', label: 'Page' },
        { field: 'perPage', label: 'Per page' },
    ] as const)('$field validation', ({ field, label }) => {
        it.each([
            {
                case: 'a nonnumeric value',
                value: 'abc',
                message: 'must be a number',
            },
            {
                case: 'a decimal',
                value: 1.5,
                message: 'must be an integer',
            },
            {
                case: 'zero',
                value: 0,
                message: 'must be greater than zero',
            },
            {
                case: 'a negative number',
                value: -1,
                message: 'must be greater than zero',
            },
        ])('rejects $case', ({ value, message }) => {
            const result = validateCategoryListingParamsSchema({
                [field]: value,
            });

            expect(result).toEqual(
                fail({
                    code: 'VALIDATION',
                    message: 'Invalid Query Parameters',
                    fields: {
                        [field]: [`${label} ${message}`],
                    },
                }),
            );
        });
    });

    it('rejects a search longer than 100 characters', () => {
        const result = validateCategoryListingParamsSchema({
            ...validInput,
            search: 'a'.repeat(101),
        });

        expect(result).toEqual(
            fail({
                code: 'VALIDATION',
                message: 'Invalid Query Parameters',
                fields: {
                    search: ['Search query must be at most 100 characters long'],
                },
            }),
        );
    });

    it('rejects a perPage value greater than 100', () => {
        const result = validateCategoryListingParamsSchema({
            ...validInput,
            perPage: 101,
        });

        expect(result).toEqual(
            fail({
                code: 'VALIDATION',
                message: 'Invalid Query Parameters',
                fields: {
                    perPage: ['Per page must be at most 100'],
                },
            }),
        );
    });

    it.each([
        {
            field: 'status',
            expectedMessage: 'Status must be one of active, inactive, or all',
        },
        {
            field: 'sortBy',
            expectedMessage: 'Sort by must be one of name, createdAt, or updatedAt',
        },
        {
            field: 'sortOrder',
            expectedMessage: 'Sort order must be one of asc or desc',
        },
    ] as const)('rejects an invalid $field', ({ field, expectedMessage }) => {
        const result = validateCategoryListingParamsSchema({
            ...validInput,
            [field]: 'invalidValue',
        });

        expect(result).toEqual(
            fail({
                code: 'VALIDATION',
                message: 'Invalid Query Parameters',
                fields: {
                    [field]: [expectedMessage],
                },
            }),
        );
    });
});
