import { z } from "zod";
import { ok, fail, Result } from "@/types/result.type";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(40, "Category name must be at most 40 characters long"),
  description: z
    .string()
    .trim()
    .max(255, "Category description must be at most 255 characters long")
    .optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Category slug is required")
    .max(40, "Category slug must be at most 40 characters long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Category slug must be URL-friendly (lowercase letters, numbers, and hyphens only)",
    ),
  isActive: z.boolean().default(true),
});

export type CreateCategoryInput = z.output<typeof createCategorySchema>;
export type CreateCategoryFormInput = z.input<typeof createCategorySchema>;

export const validateCreateCategoryInput = (
  data: unknown,
): Result<CreateCategoryInput> => {
  const result = createCategorySchema.safeParse(data);
  if (!result.success) {
    return fail({
      code: "VALIDATION",
      message: "Invalid input data",
      fields: z.flattenError(result.error).fieldErrors,
    });
  }
  return ok(result.data);
};
