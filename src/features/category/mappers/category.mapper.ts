import type { Prisma, Category as PrismaCategory } from '@/generated/prisma';
import type { Category } from '../types/category.type';
import type { CategoryDto } from '../dtos/category.dto';
import type { CreateCategoryInput } from '../validators/create-category.validator';

export const CategoryMapper = {
    toDomain(raw: PrismaCategory): Category {
        return {
            id: raw.id,
            name: raw.name,
            slug: raw.slug,
            description: raw.description,
            isActive: raw.isActive,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        };
    },
    toDto(domain: Category): CategoryDto {
        return {
            id: domain.id,
            name: domain.name,
            slug: domain.slug,
            description: domain.description ?? undefined,
            isActive: domain.isActive,
            createdAt: domain.createdAt.toISOString(),
            updatedAt: domain.updatedAt.toISOString(),
        };
    },
    toPrismaCreate(input: CreateCategoryInput): Prisma.CategoryCreateInput {
        return {
            name: input.name,
            slug: input.slug,
            description: input.description,
            isActive: input.isActive,
        };
    },
};
