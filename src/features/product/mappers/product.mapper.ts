import type { Product as PrismaProduct } from '@/generated/prisma';
import type { Product } from '../types/product.type';
import type { ProductDto } from '../dtos/product.dto';

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
};
