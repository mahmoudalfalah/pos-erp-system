import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { Role } from '@/features/auth/types/role.types';
import { fail, ok } from '@/types/result.type';

import { createCategoryAction } from '../actions/create-category.action';
import { CategoryMapper } from '../mappers/category.mapper';
import { createCategory } from '../services/create-category.service';
import type { Category } from '../types/category.type';
import {
    validateCreateCategoryInput,
    type CreateCategoryInput,
} from '../validators/create-category.validator';

vi.mock('@/features/auth/services/authorize-action.service', () => ({
    authorizeAction: vi.fn(),
}));

const mockAuthorizeAction = vi.mocked(authorizeAction);

vi.mock('../validators/create-category.validator', () => ({
    validateCreateCategoryInput: vi.fn(),
}));

const mockValidateCreateCategoryInput = vi.mocked(validateCreateCategoryInput);

vi.mock('../services/create-category.service', () => ({
    createCategory: vi.fn(),
}));

const mockCreateCategory = vi.mocked(createCategory);

const now = new Date();

const createCategoryInput: CreateCategoryInput = {
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

const AUTHORIZED_ROLES: readonly Role[] = [Role.ADMIN, Role.MANAGER];

const authorizedUser = {
    id: 'user-id',
    role: AUTHORIZED_ROLES[0],
};

describe('createCategoryAction', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should create a category with valid input and return the DTO', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockValidateCreateCategoryInput.mockReturnValueOnce(ok(createCategoryInput));
        mockCreateCategory.mockResolvedValueOnce(ok(domainCategory));

        const result = await createCategoryAction(createCategoryInput);

        expect(result).toStrictEqual(ok(CategoryMapper.toDto(domainCategory)));

        expect(mockAuthorizeAction).toHaveBeenCalledOnce();
        expect(mockValidateCreateCategoryInput).toHaveBeenCalledWith(createCategoryInput);
        expect(mockCreateCategory).toHaveBeenCalledWith(createCategoryInput);
    });
    it('should propogate authorization error if the user is not authorized', async () => {
        const authorizationFailure = fail({
            code: 'AUTH_FORBIDDEN',
            message: 'User does not have permission to perform this action.',
        });

        mockAuthorizeAction.mockResolvedValueOnce(authorizationFailure);

        const result = await createCategoryAction(createCategoryInput);

        expect(result).toStrictEqual(authorizationFailure);

        expect(mockAuthorizeAction).toHaveBeenCalledOnce();
        expect(mockCreateCategory).not.toHaveBeenCalled();
        expect(mockValidateCreateCategoryInput).not.toHaveBeenCalled();
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

        mockValidateCreateCategoryInput.mockReturnValueOnce(validationFailure);

        const result = await createCategoryAction(createCategoryInput);

        expect(result).toStrictEqual(validationFailure);

        expect(mockAuthorizeAction).toHaveBeenCalledOnce();
        expect(mockCreateCategory).not.toHaveBeenCalled();
        expect(mockValidateCreateCategoryInput).toHaveBeenCalledWith(createCategoryInput);
    });
    it('should propogate service errors', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockValidateCreateCategoryInput.mockReturnValueOnce(ok(createCategoryInput));
        const serviceError = fail({
            code: 'CATEGORY_ALREADY_EXISTS',
            message: 'Category already exists',
        });
        mockCreateCategory.mockResolvedValueOnce(serviceError);

        const result = await createCategoryAction(createCategoryInput);
        expect(result).toEqual(serviceError);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockValidateCreateCategoryInput).toHaveBeenCalledWith(createCategoryInput);
        expect(mockCreateCategory).toHaveBeenCalledWith(createCategoryInput);
    });
    it('should return an UNEXPECTED failure if something goes wrong', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockValidateCreateCategoryInput.mockReturnValueOnce(ok(createCategoryInput));

        mockCreateCategory.mockRejectedValueOnce(new Error('Something went wrong'));

        const result = await createCategoryAction(createCategoryInput);

        expect(result).toEqual(
            fail({
                code: 'UNEXPECTED',
                message: 'An unexpected error occurred while creating the category',
            }),
        );
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockValidateCreateCategoryInput).toHaveBeenCalledWith(createCategoryInput);
        expect(mockCreateCategory).toHaveBeenCalledWith(createCategoryInput);
    });
});
