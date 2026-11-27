import type { Prisma, Brand as PrismaBrand } from '@/generated/prisma';

import type { BrandDto } from '../dtos/brand.dto';
import type { Brand } from '../types/brand.type';
import type { CreateBrandInput } from '../validators/create-brand.validator';

export const BrandMapper = {
    toDomain(raw: PrismaBrand): Brand {
        return {
            id: raw.id,
            name: raw.name,
            slug: raw.slug,
            description: raw.description,
            isActive: raw.isActive,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        };
    },
    toDto(domain: Brand): BrandDto {
        return {
            id: domain.id,
            name: domain.name,
            slug: domain.slug,
            description: domain.description ?? undefined,
            isActive: domain.isActive,
            createdAt: domain.createdAt.toISOString(),
            updatedAt: domain.updatedAt.toISOString(),
        };
    },
    toPrismaCreate(input: CreateBrandInput): Prisma.BrandCreateInput {
        return {
            name: input.name,
            slug: input.slug,
            description: input.description,
            isActive: input.isActive,
        };
    },
};
