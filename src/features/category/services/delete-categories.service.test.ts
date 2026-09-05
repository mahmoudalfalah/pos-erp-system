import { fail, ok } from '@/types/result.type';
import { mockInteractiveTransaction, mockPrisma } from '@/tests/mocks/db';

import { deleteCategories } from './delete-categories.service';

vi.mock('server-only', () => ({}));

const categoriesIds = [
    'cmshgwq8w0000u0slabj2njs8',
    'cmshgwq8w0002u0slwso2tvoy',
    'cmshgwq8w0006u0sl2gpc2808',
];

describe('deleteCategories', () => {
    beforeEach(() => {
        mockInteractiveTransaction();
    });
    it('returns all categories ids when all categories are found', async () => {
        mockPrisma.category.updateMany.mockResolvedValueOnce({
            count: categoriesIds.length,
        });
        const result = await deleteCategories(categoriesIds);
        expect(result).toStrictEqual(ok({ ids: categoriesIds }));
    });
    it('Deduplicates categories IDs before deleting', async () => {
        const categoriesIdsWithDuplicates = [...categoriesIds, ...categoriesIds];
        mockPrisma.category.updateMany.mockResolvedValueOnce({
            count: categoriesIds.length,
        });
        const result = await deleteCategories(categoriesIdsWithDuplicates);
        expect(result).toStrictEqual(ok({ ids: categoriesIds }));
        expect(mockPrisma.category.updateMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    id: {
                        in: [...new Set(categoriesIdsWithDuplicates)],
                    },
                    deletedAt: null,
                },
                data: {
                    deletedAt: expect.any(Date),
                },
            }),
        );
    });
    it('returns CATEGORY_NOT_FOUND when some categories are missing or already deleted', async () => {
        mockPrisma.category.updateMany.mockResolvedValueOnce({
            count: categoriesIds.length - 1,
        });
        const result = await deleteCategories(categoriesIds);
        expect(result).toStrictEqual(
            fail({
                code: 'CATEGORY_NOT_FOUND',
                message: 'Some categories were not found or already deleted',
            }),
        );
    });
    it('returns UNEXPECTED fail when there is an unexpected error', async () => {
        mockPrisma.category.updateMany.mockRejectedValueOnce(new Error('Database timeout'));
        const result = await deleteCategories(categoriesIds);
        expect(result).toStrictEqual(
            fail({
                code: 'UNEXPECTED',
                message: 'An unexpected error occurred while deleting the categories',
            }),
        );
    });
});
