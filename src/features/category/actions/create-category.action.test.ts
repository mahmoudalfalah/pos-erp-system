import { createCategoryAction } from '../actions/create-category.action';
import { createCategory } from '../services/create-category.service';
import { fail, ok } from '@/types/result.type';
import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { Role } from '@/features/auth/types/role.types';

vi.mock('../services/create-category.service', () => ({
    createCategory: vi.fn(),
}));

const mockCreateCategory = vi.mocked(createCategory);

vi.mock('@/features/auth/services/authorize-action.service', () => ({
    authorizeAction: vi.fn(),
}));

const mockAuthorizeAction = vi.mocked(authorizeAction);

const validInput = {
    name: 'Electronics',
    slug: 'electronics',
    description: 'All kinds of electronic items',
    isActive: true,
};

const mockCategory = {
    id: 'electronics-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...validInput,
};

describe('createCategoryAction', () => {
    beforeEach(() => {
        mockAuthorizeAction.mockReset();
        mockCreateCategory.mockReset();
    });
    it('propagates an authorization failure without calling the service', async () => {
        const unauthorizedFailuler = fail({
            code: 'AUTH_FORBIDDEN',
            message: 'User does not have permission to perform this action.',
        });

        mockAuthorizeAction.mockResolvedValueOnce(unauthorizedFailuler);

        const result = await createCategoryAction(validInput);
        expect(result).toEqual(unauthorizedFailuler);
        expect(mockAuthorizeAction).toHaveBeenCalledOnce();
        expect(mockCreateCategory).not.toHaveBeenCalled();
    });

    it('returns a validation error for invalid input data', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(
            ok({
                id: 'user-id',
                role: Role.ADMIN,
            }),
        );
        const invalidInput = {
            ...validInput,
            name: '',
        };
        const result = await createCategoryAction(invalidInput);
        expect(result).toEqual(
            fail({
                code: 'VALIDATION',
                message: 'Invalid input data',
                fields: {
                    name: ['Category name is required'],
                },
            }),
        );
        expect(mockAuthorizeAction).toHaveBeenCalledOnce();
        expect(mockCreateCategory).not.toHaveBeenCalled();
    });
    it('propagates a service failure', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(
            ok({
                id: 'user-id',
                role: Role.ADMIN,
            }),
        );
        mockCreateCategory.mockResolvedValueOnce(
            fail({
                code: 'CATEGORY_ALREADY_EXISTS',
                message: 'A category with the same unique fields already exists.',
                fields: {
                    name: [`Category with name "${validInput.name}" already exists.`],
                },
            }),
        );
        const result = await createCategoryAction(validInput);
        expect(result).toEqual(
            fail({
                code: 'CATEGORY_ALREADY_EXISTS',
                message: 'A category with the same unique fields already exists.',
                fields: {
                    name: [`Category with name "${validInput.name}" already exists.`],
                },
            }),
        );
        expect(mockAuthorizeAction).toHaveBeenCalledOnce();
        expect(mockCreateCategory).toHaveBeenCalledOnce();
    });
    it('handles unexpected errors gracefully', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(
            ok({
                id: 'user-id',
                role: Role.ADMIN,
            }),
        );

        mockCreateCategory.mockRejectedValueOnce(new Error('Database connection lost'));

        const result = await createCategoryAction(validInput);

        expect(result).toEqual(
            fail({
                code: 'UNEXPECTED',
                message: 'An unexpected error occurred while creating the category',
            }),
        );
    });
    it('returns a success result for valid input data', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(
            ok({
                id: 'user-id',
                role: Role.ADMIN,
            }),
        );
        mockCreateCategory.mockResolvedValueOnce(ok(mockCategory));
        const result = await createCategoryAction(validInput);
        expect(result).toEqual(
            ok({
                ...mockCategory,
                createdAt: mockCategory.createdAt.toISOString(),
                updatedAt: mockCategory.updatedAt.toISOString(),
            }),
        );
        expect(mockAuthorizeAction).toHaveBeenCalledOnce();
        expect(mockCreateCategory).toHaveBeenCalledOnce();
    });
});
