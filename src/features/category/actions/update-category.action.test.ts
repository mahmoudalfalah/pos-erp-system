import { revalidatePath } from 'next/cache';
import { updateCategoryAction } from '../actions/update-category.action';
import { updateCategory } from '../services/update-category.service';
import { fail, ok } from '@/types/result.type';
import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { Role } from '@/features/auth/types/role.types';
import { CategoryMapper } from '../mappers/category.mapper';

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

const mockRevalidatePath = vi.mocked(revalidatePath);

vi.mock('../services/update-category.service', () => ({
    updateCategory: vi.fn(),
}));

const mockUpdateCategory = vi.mocked(updateCategory);

vi.mock('@/features/auth/services/authorize-action.service', () => ({
    authorizeAction: vi.fn(),
}));

const mockAuthorizeAction = vi.mocked(authorizeAction);

const AUTHORIZED_ROLES: readonly Role[] = [Role.ADMIN, Role.MANAGER];

const authorizedUser = {
    id: 'user-id',
    role: Role.ADMIN,
};

const CATEGORY_ID = '22';

const validInput = {
    name: 'Furniture',
    slug: 'furniture',
    description: 'All kinds of furniture',
    isActive: true,
};

const mockCategory = {
    id: 'electronics-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...validInput,
};

describe('updateCategoryAction', () => {
    beforeEach(() => {
        mockRevalidatePath.mockReset();
        mockAuthorizeAction.mockReset();
        mockUpdateCategory.mockReset();
    });

    it('returns a success result for valid input data', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockUpdateCategory.mockResolvedValueOnce(ok(mockCategory));

        const result = await updateCategoryAction(CATEGORY_ID, validInput);

        expect(result).toStrictEqual(ok(CategoryMapper.toDto(mockCategory)));
        expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard/categories');
        expect(mockAuthorizeAction).toHaveBeenCalledOnce();
        expect(mockUpdateCategory).toHaveBeenCalledOnce();
    });

    it('propagates an authorization failure without calling the service', async () => {
        const unauthorizedFailure = fail({
            code: 'AUTH_FORBIDDEN',
            message: 'User does not have permission to perform this action.',
        });
        mockAuthorizeAction.mockResolvedValueOnce(unauthorizedFailure);

        const result = await updateCategoryAction(CATEGORY_ID, validInput);

        expect(result).toEqual(unauthorizedFailure);
        expect(mockRevalidatePath).not.toHaveBeenCalled();
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockUpdateCategory).not.toHaveBeenCalled();
    });

    it('returns a validation error for invalid input data', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        const invalidInput = {
            ...validInput,
            name: '',
        };

        const result = await updateCategoryAction(CATEGORY_ID, invalidInput);

        expect(result).toEqual(
            fail(
                expect.objectContaining({
                    code: 'VALIDATION',
                    message: 'Invalid input data',
                }),
            ),
        );
        expect(mockRevalidatePath).not.toHaveBeenCalled();
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockUpdateCategory).not.toHaveBeenCalled();
    });
    it('propagates a service failure', async () => {
        const updateCategoryFailure = fail({
            code: 'CATEGORY_ALREADY_EXISTS',
            message: 'A category with the same unique fields already exists.',
            fields: {
                name: [`Category with name "${validInput.name}" already exists.`],
            },
        });
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockUpdateCategory.mockResolvedValueOnce(updateCategoryFailure);

        const result = await updateCategoryAction(CATEGORY_ID, validInput);
        expect(result).toStrictEqual(updateCategoryFailure);

        expect(mockRevalidatePath).not.toHaveBeenCalled();
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockUpdateCategory).toHaveBeenCalledWith(CATEGORY_ID, validInput);
    });
    it('handles unexpected errors gracefully', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockUpdateCategory.mockRejectedValueOnce(new Error('Database connection lost'));

        const result = await updateCategoryAction(CATEGORY_ID, validInput);

        expect(result).toStrictEqual(
            fail({
                code: 'UNEXPECTED',
                message: 'An unexpected error occurred while updating the category',
            }),
        );
        expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
});
