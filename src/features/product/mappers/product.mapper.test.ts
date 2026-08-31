import { ProductMapper } from './product.mapper';

import type { Prisma, Product as PrismaProduct } from '@/generated/prisma';
import type { Product } from '../types/product.type';
import type { ProductDto } from '../dtos/product.dto';
import type { CreateProductInput } from '../validators/create-product.validator';

const createdAt = new Date();
const updatedAt = new Date();

const rawProduct: PrismaProduct = {
    id: 'macbooks',
    name: 'MacBook Pro',
    slug: 'macbook-pro',
    sku: 'macbook-pro-2024',
    barcode: '8541241241414',
    description: 'Apple MacBook Pro',
    currentPrice: 1499.99,
    currentCost: 1299.99,
    isActive: true,
    createdAt,
    updatedAt,
    deletedAt: null,
    categoryId: 'laptop',
    brandId: 'apple',
};

const domainProduct: Product = {
    id: 'macbooks',
    name: 'MacBook Pro',
    slug: 'macbook-pro',
    sku: 'macbook-pro-2024',
    barcode: '8541241241414',
    description: 'Apple MacBook Pro',
    currentPrice: 1499.99,
    currentCost: 1299.99,
    isActive: true,
    categoryId: 'laptop',
    brandId: 'apple',
    createdAt,
    updatedAt,
};

const dtoProduct: ProductDto = {
    id: 'macbooks',
    name: 'MacBook Pro',
    slug: 'macbook-pro',
    sku: 'macbook-pro-2024',
    barcode: '8541241241414',
    description: 'Apple MacBook Pro',
    currentPrice: 1499.99,
    currentCost: 1299.99,
    isActive: true,
    categoryId: 'laptop',
    brandId: 'apple',
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
};

const createProductInput: CreateProductInput = {
    name: 'MacBook Pro',
    slug: 'macbook-pro',
    sku: 'macbook-pro-2024',
    barcode: '8541241241414',
    description: 'Apple MacBook Pro',
    currentPrice: 1499.99,
    currentCost: 1299.99,
    isActive: true,
    categoryId: 'laptop',
    brandId: 'apple',
};

const prismaCreateProduct: Prisma.ProductUncheckedCreateInput = {
    name: 'MacBook Pro',
    slug: 'macbook-pro',
    sku: 'macbook-pro-2024',
    barcode: '8541241241414',
    description: 'Apple MacBook Pro',
    currentPrice: 1499.99,
    currentCost: 1299.99,
    isActive: true,
    categoryId: 'laptop',
    brandId: 'apple',
};

describe('ProductMapper', () => {
    describe('toDomain', () => {
        it('maps a Prisma product to the domain model', () => {
            expect(ProductMapper.toDomain(rawProduct)).toStrictEqual(domainProduct);
        });
    });
    describe('toDto', () => {
        it('maps a product to a serializable DTO', () => {
            expect(ProductMapper.toDto(domainProduct)).toStrictEqual(dtoProduct);
        });
        it('maps optional null fields to undefined', () => {
            const missingOptionalFieldsProduct: Product = {
                ...domainProduct,
                description: null,
                barcode: null,
                brandId: null,
            };
            const result = ProductMapper.toDto(missingOptionalFieldsProduct);
            expect(result).toStrictEqual({
                ...dtoProduct,
                description: undefined,
                barcode: undefined,
                brandId: undefined,
            });
        });
    });
    describe('toPrismaCreate', () => {
        it('maps input to a Prisma create object', () => {
            expect(ProductMapper.toPrismaCreate(createProductInput)).toStrictEqual(
                prismaCreateProduct,
            );
        });
    });
});
