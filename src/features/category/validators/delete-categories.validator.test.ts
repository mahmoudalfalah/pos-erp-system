import { validateDeleteCategories } from './delete-categories.validator';
import { ok, fail } from '@/types/result.type';

describe('validateDeleteCategories', () => {
    it('accepts an array of valid ids', () => {
        const validCategoriesIds = ['elektronics-cateogry'];
        const result = validateDeleteCategories(validCategoriesIds);
        expect(result).toStrictEqual(ok({ ids: validCategoriesIds }));
    });
    it('rejects an array containing an invalid id', () => {
        const invalidIds = ['valid-id', ''];

        const result = validateDeleteCategories(invalidIds);

        expect(result).toStrictEqual(
            fail({
                code: 'VALIDATION',
                message: 'Invalid Category IDs',
            }),
        );
    });
    it('rejects an empty array', () => {
        const result = validateDeleteCategories([]);
        expect(result).toStrictEqual(
            fail({
                code: 'VALIDATION',
                message: 'Invalid Category IDs',
            }),
        );
    });
});
