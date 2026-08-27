import { validateCreateProductInput } from './create-product.validator';
import { ok, fail } from '@/types/result.type';

const validInput = {
    name: 'Electronics',
    slug: 'electronics',
    sku: 'sku',
    currentPrice: 100,
    currentCost: 100,
    categoryId: 'cat_123',
    isActive: true,
};

describe('validateCreateProductInput', () => {
    it('trims input and defaults isActive to true', () => {
        const result = validateCreateProductInput({
            ...validInput,
            name: '  Electronics  ',
            slug: '  electronics  ',
            sku: ' sku  ',
            barcode: '  barcode ',
            description: '  All kinds of electronic items  ',
            categoryId: ' category_123 ',
            brandId: ' brand_123 ',
        });
        expect(result).toStrictEqual(
            ok({
                ...validInput,
                barcode: 'barcode',
                brandId: 'brand_123',
                categoryId: 'category_123',
                description: 'All kinds of electronic items',
            }),
        );
    });
    it('preserves explicit isActive value', () => {
        const result = validateCreateProductInput({
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
    it('normalizes empty strings to undefiend fro optional fields', () => {
        const result = validateCreateProductInput({
            ...validInput,
            description: '',
            barcode: '',
            brandId: '',
        });
        expect(result).toStrictEqual(
            ok({
                ...validInput,
                description: undefined,
                barcode: undefined,
                brandId: undefined,
            }),
        );
    });
    it('coerces valid string numbers to integers for price and cost', () => {
        const result = validateCreateProductInput({
            ...validInput,
            currentPrice: '100',
            currentCost: '100',
        });
        expect(result).toStrictEqual(
            ok({
                ...validInput,
                currentPrice: 100,
                currentCost: 100,
            }),
        );
    });

    it.each([
        {
            case: 'an empty name',
            field: 'name',
            overrides: { name: '' },
            message: 'Product name is required',
        },
        {
            case: 'a name longer than 100 characters',
            overrides: { name: 'A'.repeat(101) },
            field: 'name',
            message: 'Product name must be at most 100 characters long',
        },
        {
            case: 'an invalid slug',
            overrides: { slug: 'Invalid Slug!' },
            field: 'slug',
            message:
                'Product slug must be URL-friendly (lowercase letters, numbers, and hyphens only)',
        },
        {
            case: 'a description longer than 500 characters',
            overrides: { description: 'A'.repeat(501) },
            field: 'description',
            message: 'Product description must be at most 500 characters long',
        },
    ])('rejects %case', ({ overrides, field, message }) => {
        const result = validateCreateProductInput({
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
            name: 'A'.repeat(100),
            description: 'A'.repeat(200),
        };

        const result = validateCreateProductInput(input);
        expect(result).toStrictEqual(ok(input));
    });
});
