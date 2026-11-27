import 'server-only';

import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { Role } from '@/features/auth/types/role.types';
import { db } from '@/lib/db';
import type { PaginatedResult } from '@/types/pagination.type';
import { fail, ok, type Result } from '@/types/result.type';

import type { CategoryDto } from '../dtos/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';
import { buildCategoryListingQuery } from '../query-builder/category-listing.builder';
import { validateCategoryListingParamsSchema } from '../validators/category-listing.validator';

export async function listCategories(
    params: unknown,
): Promise<Result<PaginatedResult<CategoryDto>>> {
    try {
        const isAuthorized = await authorizeAction([Role.ADMIN, Role.MANAGER]);

        if (!isAuthorized.success) {
            return isAuthorized;
        }

        const parsedParams = validateCategoryListingParamsSchema(params);
        if (!parsedParams.success) {
            return parsedParams;
        }

        const query = buildCategoryListingQuery(parsedParams.data);
        const [categories, total] = await Promise.all([
            db.category.findMany(query),
            db.category.count({
                where: query.where,
            }),
        ]);
        const resultObject: PaginatedResult<CategoryDto> = {
            items: categories.map((category) => CategoryMapper.toDto(category)),
            page: parsedParams.data.page,
            perPage: parsedParams.data.perPage,
            total,
            totalPages: Math.ceil(total / parsedParams.data.perPage),
        };
        return ok(resultObject);
    } catch (error) {
        console.error('Error in listCategories:', error);
        return fail({
            code: 'UNEXPECTED',
            message: 'An unexpected error occurred while listing categories',
        });
    }
}
