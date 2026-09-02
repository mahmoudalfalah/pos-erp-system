import { Prisma, type Product } from '@/generated/prisma';
import { fail, ok } from '@/types/result.type';
import { mockPrisma } from '@/tests/mocks/db';

import { ProductMapper } from '../mappers/product.mapper';
import type { CreateProductInput } from '../validators/create-product.validator';
import { createProduct } from './create-product.service';

const prismaRawProduct: Product = {
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
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
};

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

describe('createProduct', () => {
    it('should create a product with valid input', async () => {
        mockPrisma.product.create.mockResolvedValueOnce(prismaRawProduct);
        const result = await createProduct(createProductInput);
        expect(result).toStrictEqual(ok(ProductMapper.toDomain(prismaRawProduct)));
    });

    it('should return a domain error if the product slug already exists', async () => {
        const duplicateSlugProduct: CreateProductInput = {
            ...createProductInput,
            slug: 'duplicate-slug',
        };
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`slug`)',
            { code: 'P2002', clientVersion: '5.x', meta: { target: ['slug'] } },
        );
        mockPrisma.product.create.mockRejectedValueOnce(prismaError);
        const result = await createProduct(duplicateSlugProduct);
        expect(result).toStrictEqual(
            fail({
                code: 'PRODUCT_ALREADY_EXISTS',
                message: 'A product with the same unique fields already exists.',
                fields: {
                    slug: [`Product with slug "${duplicateSlugProduct.slug}" already exists.`],
                },
            }),
        );
    });

    it('should return a domain error if the product sku already exists', async () => {
        const duplicateSkuProduct: CreateProductInput = {
            ...createProductInput,
            sku: 'duplicate-sku',
        };
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`sku`)',
            { code: 'P2002', clientVersion: '5.x', meta: { target: ['sku'] } },
        );
        mockPrisma.product.create.mockRejectedValueOnce(prismaError);
        const result = await createProduct(duplicateSkuProduct);
        expect(result).toStrictEqual(
            fail({
                code: 'PRODUCT_ALREADY_EXISTS',
                message: 'A product with the same unique fields already exists.',
                fields: { sku: [`Product with sku "${duplicateSkuProduct.sku}" already exists.`] },
            }),
        );
    });

    it('should return a domain error if the product barcode already exists', async () => {
        const duplicateBarcodeProduct: CreateProductInput = {
            ...createProductInput,
            barcode: 'duplicate-barcode',
        };
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`barcode`)',
            { code: 'P2002', clientVersion: '5.x', meta: { target: ['barcode'] } },
        );
        mockPrisma.product.create.mockRejectedValueOnce(prismaError);
        const result = await createProduct(duplicateBarcodeProduct);
        expect(result).toStrictEqual(
            fail({
                code: 'PRODUCT_ALREADY_EXISTS',
                message: 'A product with the same unique fields already exists.',
                fields: {
                    barcode: [
                        `Product with barcode "${duplicateBarcodeProduct.barcode}" already exists.`,
                    ],
                },
            }),
        );
    });

    it('should return an UNEXPECTED error for other errors', async () => {
        const genericError = new Error('Something went wrong');
        mockPrisma.product.create.mockRejectedValue(genericError);
        const result = await createProduct(createProductInput);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toMatchObject({
                code: 'UNEXPECTED',
                message: 'An unexpected error occurred while creating the product',
            });
        }
    });
});
