import { Role } from '@/features/auth';
import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { fail, ok } from '@/types/result.type';

import { ProductMapper } from '../mappers/product.mapper';
import { createProduct } from '../services/create-product.service';
import type { Product } from '../types/product.type';
import {
    validateCreateProductInput,
    type CreateProductInput,
} from '../validators/create-product.validator';
import { createProductAction } from './create-product.action';

vi.mock('@/features/auth/services/authorize-action.service', () => ({
    authorizeAction: vi.fn(),
}));

const mockAuthorizeAction = vi.mocked(authorizeAction);

vi.mock('../validators/create-product.validator', () => ({
    validateCreateProductInput: vi.fn(),
}));

const mockValidateCreateProductInput = vi.mocked(validateCreateProductInput);

vi.mock('../services/create-product.service', () => ({
    createProduct: vi.fn(),
}));

const mockCreateProduct = vi.mocked(createProduct);

const createProductInput: CreateProductInput = {
    name: 'macbook pro 16',
    slug: 'macbook-pro-16',
    sku: 'mac16',
    barcode: '1234567890123',
    description: 'Macbook pro 16 inch M4',
    currentPrice: 1699,
    currentCost: 1399,
    isActive: true,
    categoryId: 'computers',
    brandId: 'apple',
};

const now = new Date();

const domainProduct: Product = {
    id: 'macbook-pro-16-id',
    name: 'macbook pro 16',
    slug: 'macbook-pro-16',
    sku: 'mac16',
    barcode: '1234567890123',
    description: 'Macbook pro 16 inch M4',
    currentPrice: 1699,
    currentCost: 1399,
    isActive: true,
    categoryId: 'computers',
    brandId: 'apple',
    createdAt: now,
    updatedAt: now,
};

const AUTHORIZED_ROLES: readonly Role[] = [Role.ADMIN, Role.MANAGER];

const authorizedUser = {
    id: 'user-id',
    role: AUTHORIZED_ROLES[0],
};

describe('createProductAction', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should create a product with valid input and return the DTO', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockValidateCreateProductInput.mockReturnValueOnce(ok(createProductInput));
        mockCreateProduct.mockResolvedValueOnce(ok(domainProduct));

        const result = await createProductAction(createProductInput);

        expect(result).toStrictEqual(ok(ProductMapper.toDto(domainProduct)));

        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockValidateCreateProductInput).toHaveBeenCalledWith(createProductInput);
        expect(mockCreateProduct).toHaveBeenCalledWith(createProductInput);
    });
    it('should propogate authorization error if the user is not authorized', async () => {
        const authorizationFailure = fail({
            code: 'AUTH_FORBIDDEN',
            message: 'You do not have permission to create a product',
        });

        mockAuthorizeAction.mockResolvedValueOnce(authorizationFailure);
        const result = await createProductAction(createProductInput);
        expect(result).toStrictEqual(authorizationFailure);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockCreateProduct).not.toHaveBeenCalled();
        expect(mockValidateCreateProductInput).not.toHaveBeenCalled();
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
        mockValidateCreateProductInput.mockReturnValueOnce(validationFailure);
        const result = await createProductAction(createProductInput);
        expect(result).toStrictEqual(validationFailure);
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockCreateProduct).not.toHaveBeenCalled();
        expect(mockValidateCreateProductInput).toHaveBeenCalledWith(createProductInput);
    });
    it('should propogate service errors', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockValidateCreateProductInput.mockReturnValueOnce(ok(createProductInput));
        const serviceFailure = fail({
            code: 'PRODUCT_ALREADY_EXISTS',
            message: 'Product already exists',
        });
        mockCreateProduct.mockResolvedValueOnce(serviceFailure);
        const result = await createProductAction(createProductInput);
        expect(result).toStrictEqual(serviceFailure);

        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockValidateCreateProductInput).toHaveBeenCalledWith(createProductInput);
        expect(mockCreateProduct).toHaveBeenCalledWith(createProductInput);
    });
    it('should return an UNEXPECTED failure if something goes wrong', async () => {
        mockAuthorizeAction.mockResolvedValueOnce(ok(authorizedUser));
        mockValidateCreateProductInput.mockReturnValueOnce(ok(createProductInput));
        mockCreateProduct.mockRejectedValueOnce(new Error('Something went wrong'));
        const result = await createProductAction(createProductInput);
        expect(result).toStrictEqual(
            fail({
                code: 'UNEXPECTED',
                message: 'Failed to create product',
            }),
        );
        expect(mockAuthorizeAction).toHaveBeenCalledWith(AUTHORIZED_ROLES);
        expect(mockValidateCreateProductInput).toHaveBeenCalledWith(createProductInput);
        expect(mockCreateProduct).toHaveBeenCalledWith(createProductInput);
    });
});
