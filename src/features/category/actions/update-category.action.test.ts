import { revalidatePath } from 'next/cache';

import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { Role } from '@/features/auth/types/role.types';
import { fail, ok } from '@/types/result.type';

import { updateCategoryAction } from '../actions/update-category.action';
import { CategoryMapper } from '../mappers/category.mapper';
import { updateCategory } from '../services/update-category.service';
import { Category } from '../types/category.type';
import {
    UpdateCategoryInput,
    validateUpdateCategoryInput,
} from '../validators/update-category.validator';

vi.mock('../validators/update-category.validator', () => ({
    validateUpdateCategoryInput: vi.fn(),
}));

const mockValidateUpdateCategoryInput = vi.mocked(validateUpdateCategoryInput);

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

const now = new Date();

const updateCategoryInput: UpdateCategoryInput = {
    name: 'Electronics',
    slug: 'electronics',
    description: 'All kinds of electronic items',
    isActive: true,
};

const domainCategory: Category = {
    id: 'electronics-id',
    name: 'Electronics',
    slug: 'electronics',
    description: 'All kinds of electronic items',
    isActive: true,
    createdAt: now,
    updatedAt: now,
};

describe('updateCategoryAction', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should update a category with valid input and return the DTO', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockValidateUpdateCategoryInput.mockReturnValueOnce(ok(updateCategoryInput));
        mockUpdateCategory.mockResolvedValueOnce(ok(domainCategory));

        const result = await updateCategoryAction(CATEGORY_ID, updateCategoryInput);

        expect(result).toStrictEqual(ok(CategoryMapper.toDto(domainCategory)));

        expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard/categories');
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockValidateUpdateCategoryInput).toHaveBeenCalledWith(updateCategoryInput);
        expect(mockUpdateCategory).toHaveBeenCalledOnce();
    });

    it('should propogate authorization error if the user is not authorized', async () => {
        const authorizationFailure = fail({
            code: 'AUTH_FORBIDDEN',
            message: 'User does not have permission to perform this action.',
        });

        mockAuthorizeAction.mockResolvedValueOnce(authorizationFailure);

        const result = await updateCategoryAction(CATEGORY_ID, updateCategoryInput);

        expect(result).toStrictEqual(authorizationFailure);

        expect(mockRevalidatePath).not.toHaveBeenCalled();
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockUpdateCategory).not.toHaveBeenCalled();
        expect(mockValidateUpdateCategoryInput).not.toHaveBeenCalled();
    });

    it('should propogate validation errors if input is invalid', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));

        const validationFailure = fail({
            code: 'VALIDATION',
            message: 'Invalid input data',
            fields: {
                slug: ['missing slug'],
            },
        });

        mockValidateUpdateCategoryInput.mockReturnValueOnce(validationFailure);

        const result = await updateCategoryAction(CATEGORY_ID, updateCategoryInput);

        expect(result).toStrictEqual(validationFailure);

        expect(mockRevalidatePath).not.toHaveBeenCalled();
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockUpdateCategory).not.toHaveBeenCalled();
    });
    it('should propogate service errors', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockValidateUpdateCategoryInput.mockReturnValueOnce(ok(updateCategoryInput));

        const serviceError = fail({
            code: 'CATEGORY_ALREADY_EXISTS',
            message: 'Category already exists',
        });

        mockUpdateCategory.mockResolvedValueOnce(serviceError);

        const result = await updateCategoryAction(CATEGORY_ID, updateCategoryInput);
        expect(result).toStrictEqual(serviceError);
        expect(mockRevalidatePath).not.toHaveBeenCalled();
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockUpdateCategory).toHaveBeenCalledWith(CATEGORY_ID, updateCategoryInput);
        expect(mockValidateUpdateCategoryInput).toHaveBeenCalledWith(updateCategoryInput);
    });
    it('should return an UNEXPECTED failure if something goes wrong', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockValidateUpdateCategoryInput.mockReturnValueOnce(ok(updateCategoryInput));

        mockUpdateCategory.mockRejectedValueOnce(new Error('Something went wrong'));

        const result = await updateCategoryAction(CATEGORY_ID, updateCategoryInput);

        expect(result).toStrictEqual(
            fail({
                code: 'UNEXPECTED',
                message: 'An unexpected error occurred while updating the category',
            }),
        );
        expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
});
