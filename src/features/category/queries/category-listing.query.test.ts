import { listCategories } from './category-listing.query';
import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { mockPrisma } from '@/tests/mocks/db';
import type { CategoryListingRawParams } from '../validators/category-listing.validator';
import type { CategoryListingResult } from '../types/category-listing.type';
import { fail, ok } from '@/types/result.type';
import { Role } from '@/features/auth';
import type { Category } from '@/generated/prisma';
import { CategoryMapper } from '../mappers/category.mapper';

vi.mock('server-only', () => ({}));

vi.mock('@/features/auth/services/authorize-action.service', () => ({
    authorizeAction: vi.fn(),
}));

const mockAuthorizeAction = vi.mocked(authorizeAction);

const validParams: CategoryListingRawParams = {
    search: 'Electronics',
    page: 1,
    perPage: 20,
    status: 'active',
    sortBy: 'name',
    sortOrder: 'desc',
};

const categoryRecord: Category = {
    id: 'category-id',
    name: 'Electronics',
    slug: 'electronics',
    description: 'All electronic items',
    isActive: true,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z'),
    deletedAt: null,
};

const AUTHORIZED_ROLES: readonly Role[] = [Role.ADMIN, Role.MANAGER];

const authorizedUser = ok({
    id: 'user-id',
    role: Role.ADMIN,
});

describe('listCategories', () => {
    beforeEach(() => {
        mockAuthorizeAction.mockReset();
    });

    it('returns the authorization failure without accessing the database', async () => {
        const authorizationFailure = fail({
            code: 'AUTH_FORBIDDEN',
            message: 'User does not have permission to perform this action.',
        });
        mockAuthorizeAction.mockResolvedValueOnce(authorizationFailure);
        const result = await listCategories(validParams);
        expect(result).toStrictEqual(authorizationFailure);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockPrisma.category.findMany).not.toHaveBeenCalled();
        expect(mockPrisma.category.count).not.toHaveBeenCalled();
    });

    it('returns the validation failure without accessing the database', async () => {
        const validationFailure = fail({
            code: 'VALIDATION',
            message: 'Invalid Query Parameters',
            fields: {
                status: ['Status must be one of active, inactive, or all'],
            },
        });
        mockAuthorizeAction.mockResolvedValueOnce(authorizedUser);
        const result = await listCategories({
            ...validParams,
            status: 'invalid',
        });
        expect(result).toStrictEqual(validationFailure);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockPrisma.category.findMany).not.toHaveBeenCalled();
        expect(mockPrisma.category.count).not.toHaveBeenCalled();
    });

    it('retrieves matching categories and returns mapped DTOs with pagination metadata', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(authorizedUser);
        mockPrisma.category.findMany.mockResolvedValueOnce([categoryRecord]);
        mockPrisma.category.count.mockResolvedValueOnce(95);
        const result = await listCategories({
            ...validParams,
            page: '3',
            perPage: '10',
        });

        const expectedResult: CategoryListingResult = {
            items: [CategoryMapper.toDto(categoryRecord)],
            page: 3,
            perPage: 10,
            total: 95,
            totalPages: 10,
        };

        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                    {
                        name: {
                            contains: validParams.search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        slug: {
                            contains: validParams.search,
                            mode: 'insensitive',
                        },
                    },
                ],
                isActive: true,
                deletedAt: null,
            },
            orderBy: [{ name: 'desc' }, { id: 'asc' }],
            skip: 20,
            take: 10,
        });
        expect(mockPrisma.category.count).toHaveBeenCalledWith({
            where: {
                OR: [
                    {
                        name: {
                            contains: validParams.search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        slug: {
                            contains: validParams.search,
                            mode: 'insensitive',
                        },
                    },
                ],
                isActive: true,
                deletedAt: null,
            },
        });
        expect(result).toStrictEqual(ok(expectedResult));
    });

    it('returns an empty listing with zero total pages when no matching results are found', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(authorizedUser);
        mockPrisma.category.findMany.mockResolvedValueOnce([]);
        mockPrisma.category.count.mockResolvedValueOnce(0);

        const result = await listCategories({
            ...validParams,
            search: 'non-existing-category',
        });

        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockPrisma.category.findMany).toHaveBeenCalledOnce();
        expect(result).toStrictEqual(
            ok({
                items: [],
                page: 1,
                perPage: 20,
                total: 0,
                totalPages: 0,
            }),
        );
    });

    it('returns an unexpected failure when the database query fails', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(authorizedUser);
        mockPrisma.category.findMany.mockRejectedValueOnce(new Error('Database error'));

        const result = await listCategories(validParams);

        expect(result).toStrictEqual(
            fail({
                code: 'UNEXPECTED',
                message: 'An unexpected error occurred while listing categories',
            }),
        );
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockPrisma.category.findMany).toHaveBeenCalledOnce();
    });
});
