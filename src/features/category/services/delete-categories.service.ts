import { ok, fail, type Result } from "@/types/result.type";
import { db } from "@/lib/db";

class CategoriesDeleteMismatchError extends Error {}

export async function deleteCategories(ids: string[]): Promise<Result<{ids: string[]}>> {
    const uniqueIds = [...new Set(ids)];
    try {

        await db.$transaction(async (tx) => {
            const result = await tx.category.updateMany({
                where: {
                    id: {
                        in: uniqueIds
                    },
                    deletedAt: null
                },
                data: {
                    deletedAt: new Date(),
                }
            });

            if (result.count !== uniqueIds.length) {
                throw new CategoriesDeleteMismatchError();
            }
        });

        return ok({ ids: uniqueIds });

    }
    catch (error) {

        if (error instanceof CategoriesDeleteMismatchError) {
            return fail({
                code: "CATEGORY_NOT_FOUND",
                message: "Some categories were not found or already deleted",
            });
        }

        return fail({
            code: "UNEXPECTED",
            message: "An unexpected error occurred while deleting the categories",
        });
    }
}