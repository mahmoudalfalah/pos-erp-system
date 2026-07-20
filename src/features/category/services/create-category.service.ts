import { db } from "@/lib/db";
import type { Category } from "../types/category.type";
import type { CreateCategoryInput } from "../validators/create-category.validator";
import { ok, fail, type Result } from "@/types/result.type";
import { CategoryMapper } from "../mappers/category.mapper";
import { getPrismaUniqueFields } from "@/utils/prisma-errors.util";


export const createCategory = async (
    input: CreateCategoryInput
): Promise<Result<Category>> => {
    try {
        const rawCategory = await db.category.create({
            data: {
                name: input.name,
                slug: input.slug,
                description: input.description,
                isActive: input.isActive,
            },
        });

        return ok(CategoryMapper.toDomain(rawCategory));
    }
    catch (e) {
            const uniqueFields = getPrismaUniqueFields(e);

            if (uniqueFields) {
                const fields: Record<string, string[]> = {};

                if (uniqueFields.includes("name")) {
                    fields.name = [`Category with name "${input.name}" already exists.`];
                }
                if (uniqueFields.includes("slug")) {
                    fields.slug = [`Category with slug "${input.slug}" already exists.`];
                }

                return fail({
                    code: "CATEGORY_ALREADY_EXISTS",
                    message: "A category with the same unique fields already exists.",
                    fields,
                });

        }
        return fail({
            code: "UNEXPECTED",
            message: "An unexpected error occurred while creating the category"
        });
    }
}