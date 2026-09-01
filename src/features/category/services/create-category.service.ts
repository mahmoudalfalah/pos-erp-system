import { db } from '@/lib/db';
import { getPrismaUniqueFields } from '@/utils/prisma-errors.util';
import { fail, ok, type Result } from '@/types/result.type';

import { CategoryMapper } from '../mappers/category.mapper';
import type { Category } from '../types/category.type';
import type { CreateCategoryInput } from '../validators/create-category.validator';

export const createCategory = async (input: CreateCategoryInput): Promise<Result<Category>> => {
    try {
        const rawCategory = await db.category.create({
            data: CategoryMapper.toPrismaCreate(input),
        });

        return ok(CategoryMapper.toDomain(rawCategory));
    } catch (e) {
        const uniqueFields = getPrismaUniqueFields(e);

        if (uniqueFields) {
            const fields: Record<string, string[]> = {};

            if (uniqueFields.includes('name')) {
                fields.name = [`Category with name "${input.name}" already exists.`];
            }
            if (uniqueFields.includes('slug')) {
                fields.slug = [`Category with slug "${input.slug}" already exists.`];
            }

            return fail({
                code: 'CATEGORY_ALREADY_EXISTS',
                message: 'A category with the same unique fields already exists.',
                fields,
            });
        }
        return fail({
            code: 'UNEXPECTED',
            message: 'An unexpected error occurred while creating the category',
        });
    }
};
