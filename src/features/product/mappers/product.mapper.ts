import type { Prisma, Product as PrismaProduct } from '@/generated/prisma';
import type { Product } from '../types/product.type';
import type { ProductDto } from '../dtos/product.dto';
import { CreateProductInput } from '../validators/create-product.validator';

export const ProductMapper = {
    toDomain(raw: PrismaProduct): Product {
        return {
            id: raw.id,
            name: raw.name,
            slug: raw.slug,
            sku: raw.sku,
            barcode: raw.barcode,
            description: raw.description,
            currentPrice: raw.currentPrice,
            currentCost: raw.currentCost,
            isActive: raw.isActive,
            categoryId: raw.categoryId,
            brandId: raw.brandId,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        };
    },
    toDto(domain: Product): ProductDto {
        return {
            id: domain.id,
            name: domain.name,
            slug: domain.slug,
            sku: domain.sku,
            barcode: domain.barcode ?? undefined,
            description: domain.description ?? undefined,
            currentPrice: domain.currentPrice,
            currentCost: domain.currentCost,
            isActive: domain.isActive,
            categoryId: domain.categoryId,
            brandId: domain.brandId ?? undefined,
            createdAt: domain.createdAt.toISOString(),
            updatedAt: domain.updatedAt.toISOString(),
        };
    },
    toPrismaCreate(input: CreateProductInput): Prisma.ProductUncheckedCreateInput {
        return {
            name: input.name,
            slug: input.slug,
            sku: input.sku,
            barcode: input.barcode,
            description: input.description,
            currentPrice: input.currentPrice,
            currentCost: input.currentCost,
            isActive: input.isActive,
            categoryId: input.categoryId,
            brandId: input.brandId,
        };
    },
};
