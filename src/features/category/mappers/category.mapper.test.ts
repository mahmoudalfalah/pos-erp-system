import { CategoryMapper } from './category.mapper';

import type { Prisma, Category as PrismaCategory } from '@/generated/prisma';
import type { Category } from '../types/category.type';
import type { CategoryDto } from '../dtos/category.dto';
import type { CreateCategoryInput } from '../validators/create-category.validator';
import type { UpdateCategoryInput } from '../validators/update-category.validator';

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

const dtoCategory: CategoryDto = {
    id: 'category-id',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic items',
    isActive: true,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
};

const createCategoryInput: CreateCategoryInput = {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic items',
    isActive: true,
};

const prismaCreateCategory: Prisma.CategoryCreateInput = {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic items',
    isActive: true,
};

const updateCategoryInput: UpdateCategoryInput = {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic items',
    isActive: true,
};

const prismaUpdateCategory: Prisma.CategoryUpdateInput = {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic items',
    isActive: true,
};

describe('CategoryMapper', () => {
    describe('toDomain', () => {
        it('maps a Prisma categoy to the domain model', () => {
            expect(CategoryMapper.toDomain(rawCategory)).toEqual(domainCategory);
        });
    });
    describe('toDto', () => {
        it('maps a category to a serializable DTO', () => {
            expect(CategoryMapper.toDto(domainCategory)).toStrictEqual(dtoCategory);
        });
        it('maps a null description to undefined', () => {
            const noDescriptionCategory = {
                ...domainCategory,
                description: null,
            };
            const result = CategoryMapper.toDto(noDescriptionCategory);
            expect(result).toStrictEqual({
                ...dtoCategory,
                description: undefined,
            });
        });
    });
    describe('toPrismaCreate', () => {
        it('maps categoy input to a Pisma create object', () => {
            expect(CategoryMapper.toPrismaCreate(createCategoryInput)).toStrictEqual(
                prismaCreateCategory,
            );
        });
    });
    describe('toPrismaUpdate', () => {
        it('maps a complete update input to a Prisma update object', () => {
            expect(CategoryMapper.toPrismaUpdate(updateCategoryInput)).toStrictEqual(
                prismaUpdateCategory,
            );
        });
        it('maps omitted fields as undefined for partial updates', () => {
            // TODO: Remove 'as UpdateCategoryInput' cast once the update schema is refactored
            // to support true PATCH (Partial) updates with OCC.
            const input = {
                name: 'Electronics',
            } as UpdateCategoryInput;

            const result = CategoryMapper.toPrismaUpdate(input);
            expect(result).toEqual({ name: 'Electronics' });
            expect(result.slug).toBeUndefined();
            expect(result.description).toBeUndefined();
            expect(result.isActive).toBeUndefined();
        });
    });
});
