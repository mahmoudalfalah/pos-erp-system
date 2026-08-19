import 'server-only';

import { ok, fail, type Result } from '@/types/result.type';
import { db } from '@/lib/db';
import { validateCategoryListingParamsSchema } from '../validators/category-listing.validator';
import { buildCategoryListingQuery } from '../query-builder/category-listing.builder';
import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { Role } from '@/features/auth/types/role.types';
import { CategoryMapper } from '../mappers/category.mapper';
import type { CategoryListingResult } from '../types/category-listing.type';

export async function listCategories(params: unknown): Promise<Result<CategoryListingResult>> {
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
    const resultObject: CategoryListingResult = {
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
