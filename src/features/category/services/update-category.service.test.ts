import { Prisma } from '@/generated/prisma';
import { fail, ok } from '@/types/result.type';
import { mockPrisma } from '@/tests/mocks/db';

import { CategoryMapper } from '../mappers/category.mapper';
import { updateCategory } from './update-category.service';

const CATEGORY_ID = '22';

const validInput = {
    name: 'Furniture',
    slug: 'furniture',
    description: 'All kinds of furniture',
    isActive: true,
};

describe('updateCategory', () => {
    it('successfully update a category and return an ok result', async () => {
        const fakeDbResponse = {
            id: CATEGORY_ID,
            name: validInput.name,
            slug: validInput.slug,
            description: validInput.description,
            isActive: validInput.isActive,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };

        mockPrisma.category.update.mockResolvedValue(fakeDbResponse);

        const result = await updateCategory(CATEGORY_ID, validInput);

        expect(result).toStrictEqual(ok(CategoryMapper.toDomain(fakeDbResponse)));
    });

    it('returns a domain error if the category name already exists', async () => {
        const duplicateCategory = {
            ...validInput,
            name: 'Electronics',
        };

        const prismaError = new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`name`)',
            { code: 'P2002', clientVersion: '5.x', meta: { target: ['name'] } },
        );
        mockPrisma.category.update.mockRejectedValue(prismaError);

        const result = await updateCategory(CATEGORY_ID, duplicateCategory);

        expect(result).toEqual(
            fail(
                expect.objectContaining({
                    code: 'CATEGORY_ALREADY_EXISTS',
                    fields: {
                        name: expect.arrayContaining([
                            expect.stringContaining(duplicateCategory.name),
                        ]),
                    },
                }),
            ),
        );
    });

    it('returns a domain error if the category slug already exists', async () => {
        const duplicateCategory = {
            ...validInput,
            slug: 'electronics',
        };
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`slug`)',
            { code: 'P2002', clientVersion: '5.x', meta: { target: ['slug'] } },
        );
        mockPrisma.category.update.mockRejectedValue(prismaError);

        const result = await updateCategory(CATEGORY_ID, duplicateCategory);

        expect(result).toEqual(
            fail(
                expect.objectContaining({
                    code: 'CATEGORY_ALREADY_EXISTS',
                    fields: {
                        slug: expect.arrayContaining([
                            expect.stringContaining(duplicateCategory.slug),
                        ]),
                    },
                }),
            ),
        );
    });

    it('returns a domain error if the category does not exist', async () => {
        const nonExsistingCategoryId = '30';

        const prismaError = new Prisma.PrismaClientKnownRequestError(
            'Record to update not found.',
            { code: 'P2025', clientVersion: '5.x' },
        );
        mockPrisma.category.update.mockRejectedValue(prismaError);

        const result = await updateCategory(nonExsistingCategoryId, validInput);

        expect(result).toStrictEqual(
            fail({
                code: 'CATEGORY_NOT_FOUND',
                message: 'Record to update not found.',
            }),
        );
    });

    it('returns an UNEXPECTED error for generic database errors', async () => {
        const genericError = new Error('Database connection lost');
        mockPrisma.category.update.mockRejectedValue(genericError);

        const result = await updateCategory(CATEGORY_ID, validInput);

        expect(result).toStrictEqual(
            fail({
                code: 'UNEXPECTED',
                message: 'An unexpected error occurred while updating the category',
            }),
        );
    });
});
