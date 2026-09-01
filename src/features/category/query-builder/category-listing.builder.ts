import type { Prisma } from '@/generated/prisma';

import type { CategoryListingQuery } from '../types/category-listing.type';
import type { CategoryListingParams } from '../validators/category-listing.validator';

export function buildCategoryListingQuery(params: CategoryListingParams): CategoryListingQuery {
    const where: Prisma.CategoryWhereInput = {
        deletedAt: null,
    };

    if (params.search !== undefined) {
        where.OR = [
            {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
            {
                slug: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
        ];
    }

    if (params.status !== 'all') {
        where.isActive = params.status === 'active';
    }

    const orderBy: Prisma.CategoryOrderByWithRelationInput[] = [
        { [params.sortBy]: params.sortOrder },
        { id: 'asc' },
    ];

    return {
        where,
        orderBy,
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
    };
}
