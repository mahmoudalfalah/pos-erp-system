import { CategoryMapper } from './category.mapper';
import type { Category as PrismaCategory } from '@/generated/prisma';
import type { Category } from '../types/category.type';

const createdAt = new Date();
const updatedAt = new Date();

const rawCategory: PrismaCategory = {
    id: 'category-id',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic items',
    isActive: true,
    createdAt,
    updatedAt,
    deletedAt: null,
};

const domainCategory: Category = {
    id: 'category-id',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic items',
    isActive: true,
    createdAt,
    updatedAt,
};

describe('CategoryMapper', () => {
    describe('toDomain', () => {
        it('maps a Prisma categoy to the domain model', () => {
            expect(CategoryMapper.toDomain(rawCategory)).toEqual(domainCategory);
        });
    });
    describe('toDto', () => {
        it('maps a category to a serializable DTO', () => {
            expect(CategoryMapper.toDto(domainCategory)).toEqual({
                ...domainCategory,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
            });
        });
        it('maps a null description to undefined', () => {
            const noDescriptionCategory = {
                ...domainCategory,
                description: null,
            };
            const result = CategoryMapper.toDto(noDescriptionCategory);
            expect(result).toStrictEqual({
                ...noDescriptionCategory,
                description: undefined,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
            });
        });
    });
});
