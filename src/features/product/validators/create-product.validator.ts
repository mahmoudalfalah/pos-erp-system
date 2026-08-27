import { fail, ok, Result } from '@/types/result.type';
import { z } from 'zod';
import { emptyToUndefined } from '@/utils/zod.util';

export const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Product name is required')
        .max(100, 'Product name must be at most 100 characters long'),
    slug: z
        .string()
        .trim()
        .min(1, 'Product slug is required')
        .max(100, 'Product slug must be at most 100 characters long')
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Product slug must be URL-friendly (lowercase letters, numbers, and hyphens only)',
        ),
    sku: z
        .string()
        .trim()
        .min(1, 'Product SKU is required')
        .max(20, 'Product SKU must be at most 20 characters long'),
    barcode: emptyToUndefined,
    description: emptyToUndefined.pipe(
        z.string().max(500, 'Product description must be at most 500 characters long').optional(),
    ),
    currentPrice: z.coerce.number().int().positive('Price must be a positive integer'),
    currentCost: z.coerce.number().int().positive('Cost must be a positive integer'),
    isActive: z.boolean().default(true),
    categoryId: z.string().trim().min(1, 'Category ID is required'),
    brandId: emptyToUndefined,
});

export type CreateProductInput = z.output<typeof createProductSchema>;
export type CreateProductRawInput = z.input<typeof createProductSchema>;

export const validateCreateProductInput = (data: unknown): Result<CreateProductInput> => {
    const result = createProductSchema.safeParse(data);
    if (!result.success) {
        return fail({
            code: 'VALIDATION',
            message: 'Invalid input data',
            fields: z.flattenError(result.error).fieldErrors,
        });
    }
    return ok(result.data);
};
