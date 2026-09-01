import type { CategoryListingParams } from '../validators/category-listing.validator';
import { buildCategoryListingQuery } from './category-listing.builder';

const baselineParams: CategoryListingParams = {
    search: undefined,
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    perPage: 20,
};

describe('buildCategoryListingQuery', () => {
    it('builds the query for the first page without filters', () => {
        const result = buildCategoryListingQuery(baselineParams);
        const expectedResult = {
            where: { deletedAt: null },
            orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
            skip: 0,
            take: 20,
        };
        expect(result).toStrictEqual(expectedResult);
    });

    it('builds a case-insensitive search filter for name and slug', () => {
        const params = {
            ...baselineParams,
            search: 'Electronics',
        };
        const result = buildCategoryListingQuery(params);
        const expectedWhere = {
            OR: [
                {
                    name: {
                        contains: 'Electronics',
                        mode: 'insensitive',
                    },
                },
                {
                    slug: {
                        contains: 'Electronics',
                        mode: 'insensitive',
                    },
                },
            ],
            deletedAt: null,
        };
        expect(result.where).toStrictEqual(expectedWhere);
    });

    it.each([
        ['active', true],
        ['inactive', false],
    ] as const)('maps the %s status to isActive: %s', (status, expectedIsActive) => {
        const params = {
            ...baselineParams,
            status: status,
        };
        const result = buildCategoryListingQuery(params);
        const expectedWhere = {
            isActive: expectedIsActive,
            deletedAt: null,
        };
        expect(result.where).toStrictEqual(expectedWhere);
    });

    it('combines search and status filters', () => {
        const params: CategoryListingParams = {
            ...baselineParams,
            search: 'Electronics',
            status: 'inactive',
        };
        const result = buildCategoryListingQuery(params);
        const expectedWhere = {
            OR: [
                {
                    name: {
                        contains: 'Electronics',
                        mode: 'insensitive',
                    },
                },
                {
                    slug: {
                        contains: 'Electronics',
                        mode: 'insensitive',
                    },
                },
            ],
            isActive: false,
            deletedAt: null,
        };

        expect(result.where).toStrictEqual(expectedWhere);
    });

    it('calculates skip and take for pagination', () => {
        const params = {
            ...baselineParams,
            page: 3,
            perPage: 25,
        };
        const result = buildCategoryListingQuery(params);

        expect(result.skip).toBe(50);
        expect(result.take).toBe(25);
    });

    it('builds the requested sorting with an ascending ID tie-breaker', () => {
        const params: CategoryListingParams = {
            ...baselineParams,
            sortBy: 'name',
            sortOrder: 'asc',
        };

        const result = buildCategoryListingQuery(params);

        const expectedOrderBy = [
            {
                name: 'asc',
            },
            {
                id: 'asc',
            },
        ];

        expect(result.orderBy).toStrictEqual(expectedOrderBy);
    });
});
