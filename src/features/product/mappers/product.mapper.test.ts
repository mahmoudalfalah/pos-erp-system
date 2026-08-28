import { ProductMapper } from './product.mapper';
import type { Product as PrismaProduct } from '@/generated/prisma';
import type { Product } from '../types/product.type';

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

const { deletedAt: _deletedAt, ...rest } = rawProduct;

const domainProduct: Product = rest;

describe('ProductMapper', () => {
    describe('toDomain', () => {
        it('maps a Prisma product to the domain model', () => {
            expect(ProductMapper.toDomain(rawProduct)).toEqual(domainProduct);
        });
    });
    describe('toDto', () => {
        it('maps a product to a serializable DTO', () => {
            expect(ProductMapper.toDto(domainProduct)).toEqual({
                ...domainProduct,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
            });
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
                ...missingOptionalFieldsProduct,
                description: undefined,
                barcode: undefined,
                brandId: undefined,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
            });
        });
    });
});
