import type { Product as PrismaProduct } from '@/generated/prisma';
import type { Product } from '../types/product.type';
import type { ProductDto } from '../dtos/product.dto';

export const ProductMapper = {
    toDomain: (raw: PrismaProduct): Product => ({
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
    }),

    toDto: (domain: Product): ProductDto => ({
        ...domain,
        barcode: domain.barcode ?? undefined,
        brandId: domain.brandId ?? undefined,
        description: domain.description ?? undefined,
        createdAt: domain.createdAt.toISOString(),
        updatedAt: domain.updatedAt.toISOString(),
    }),
};
