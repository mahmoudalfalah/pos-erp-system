import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required")
        .max(40, "Category name must be less than 40 characters"),
    description: z
        .string()
        .trim()
        .max(255, "Description must be less than 255 characters")
        .optional(),
    slug: z
        .string()
        .trim()
        .min(1, "Slug is required")
        .max(40, "Slug must be less than 40 characters")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)"),
    isActive: z
        .boolean()
        .default(true)
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;