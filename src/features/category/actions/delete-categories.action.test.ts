import { Role } from '@/features/auth';
import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { fail, ok } from '@/types/result.type';

import { deleteCategories } from '../services/delete-categories.service';
import { validateDeleteCategories } from '../validators/delete-categories.validator';
import { deleteCategoriesAction } from './delete-categories.action';

vi.mock('../validators/delete-categories.validator', () => ({
    validateDeleteCategories: vi.fn(),
}));

vi.mock('server-only', () => ({}));

const mockValidateDeleteCategories = vi.mocked(validateDeleteCategories);

vi.mock('@/features/auth/services/authorize-action.service', () => ({
    authorizeAction: vi.fn(),
}));

vi.mock('../services/delete-categories.service', () => ({
    deleteCategories: vi.fn(),
}));

const mockAuthorizeAction = vi.mocked(authorizeAction);
const mockDeleteCategories = vi.mocked(deleteCategories);

const categoriesIds = [
    'cmshgwq8w0000u0slabj2njs8',
    'cmshgwq8w0002u0slwso2tvoy',
    'cmshgwq8w0006u0sl2gpc2808',
];

const AUTHORIZED_ROLES: readonly Role[] = [Role.ADMIN, Role.MANAGER];

const authorizedUser = ok({
    id: 'user-id',
    role: Role.ADMIN,
});

describe('deleteCategoriesAction', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should return the delete service result when deletion succeeds', async () => {
        const expectedResultData = ok({
            ids: categoriesIds,
        });
        mockAuthorizeAction.mockResolvedValueOnce(authorizedUser);
        mockDeleteCategories.mockResolvedValueOnce(expectedResultData);
        mockValidateDeleteCategories.mockReturnValueOnce(ok({ ids: categoriesIds }));

        const result = await deleteCategoriesAction(categoriesIds);
        expect(result).toStrictEqual(expectedResultData);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockDeleteCategories).toHaveBeenCalledWith(categoriesIds);
        expect(mockValidateDeleteCategories).toHaveBeenCalledWith(categoriesIds);
    });
    it('should return authorization failure when the user is not authorized', async () => {
        const authorizationFailure = fail({
            code: 'AUTH_FORBIDDEN',
            message: 'User does not have permission to perform this action.',
        });
        mockAuthorizeAction.mockResolvedValueOnce(authorizationFailure);

        const result = await deleteCategoriesAction(categoriesIds);
        expect(result).toStrictEqual(authorizationFailure);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockDeleteCategories).not.toHaveBeenCalled();
        expect(mockValidateDeleteCategories).not.toHaveBeenCalled();
    });

    it('should return validation failure without calling the delete service', async () => {
        const validationFailure = fail({
            code: 'VALIDATION',
            message: 'Cannot delete categories without providing IDs',
        });
        mockAuthorizeAction.mockResolvedValueOnce(authorizedUser);
        mockValidateDeleteCategories.mockReturnValueOnce(validationFailure);
        const result = await deleteCategoriesAction([]);
        expect(result).toStrictEqual(validationFailure);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockDeleteCategories).not.toHaveBeenCalled();
        expect(mockValidateDeleteCategories).toHaveBeenCalledWith([]);
    });

    it('should propagate delete service failures', async () => {
        const failure = fail({
            code: 'CATEGORY_NOT_FOUND',
            message: 'Some categories were not found or already deleted',
        });
        mockAuthorizeAction.mockResolvedValueOnce(authorizedUser);
        mockDeleteCategories.mockResolvedValueOnce(failure);
        mockValidateDeleteCategories.mockReturnValueOnce(ok({ ids: categoriesIds }));
        const result = await deleteCategoriesAction(categoriesIds);
        expect(result).toStrictEqual(failure);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockDeleteCategories).toHaveBeenCalledWith(categoriesIds);
        expect(mockValidateDeleteCategories).toHaveBeenCalledWith(categoriesIds);
    });

    it('returns UNEXPECTED when an unhandled error is thrown', async () => {
        const unexpectedError = fail({
            code: 'UNEXPECTED',
            message: 'An unexpected error occurred while deleting the categories',
        });
        mockAuthorizeAction.mockResolvedValueOnce(authorizedUser);
        mockDeleteCategories.mockRejectedValueOnce(new Error('Something went wrong'));
        mockValidateDeleteCategories.mockReturnValueOnce(ok({ ids: categoriesIds }));
        const result = await deleteCategoriesAction(categoriesIds);
        expect(result).toStrictEqual(unexpectedError);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockDeleteCategories).toHaveBeenCalledWith(categoriesIds);
        expect(mockValidateDeleteCategories).toHaveBeenCalledWith(categoriesIds);
    });
});
