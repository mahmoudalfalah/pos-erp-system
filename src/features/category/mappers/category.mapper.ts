import type { Category as PrismaCategory } from "@/generated/prisma";
import type { Category } from "../types/category.type";
import type { CategoryDTO } from "../dtos/category.dto";

export const CategoryMapper = {
    toDomain(raw: PrismaCategory): Category {
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
    toDto(domain: Category): CategoryDTO {
        return {
            ...domain,
            createdAt: domain.createdAt.toISOString(),
            updatedAt: domain.updatedAt.toISOString(),
        };
    }
}