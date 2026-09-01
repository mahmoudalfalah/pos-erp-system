import { z } from 'zod';

import { fail, ok, type Result } from '@/types/result.type';

export const categoryListingParamsSchema = z.object({
    search: z
        .string()
        .trim()
        .max(100, 'Search query must be at most 100 characters long')
        .transform((val) => val || undefined)
        .optional(),
    page: z.coerce
        .number({ error: 'Page must be a number' })
        .int({ error: 'Page must be an integer' })
        .positive({ error: 'Page must be greater than zero' })
        .default(1),
    perPage: z.coerce
        .number({ error: 'Per page must be a number' })
        .int({ error: 'Per page must be an integer' })
        .positive({ error: 'Per page must be greater than zero' })
        .max(100, 'Per page must be at most 100')
        .default(20),
    status: z
        .enum(['active', 'inactive', 'all'], {
            error: 'Status must be one of active, inactive, or all',
        })
        .default('all'),
    sortBy: z
        .enum(['name', 'createdAt', 'updatedAt'], {
            error: 'Sort by must be one of name, createdAt, or updatedAt',
        })
        .default('createdAt'),
    sortOrder: z
        .enum(['asc', 'desc'], {
            error: 'Sort order must be one of asc or desc',
        })
        .default('desc'),
});

export type CategoryListingRawParams = z.input<typeof categoryListingParamsSchema>;

export type CategoryListingParams = z.output<typeof categoryListingParamsSchema>;

export function validateCategoryListingParamsSchema(
    params: unknown,
): Result<CategoryListingParams> {
    const result = categoryListingParamsSchema.safeParse(params);
    if (!result.success) {
        return fail({
            code: 'VALIDATION',
            message: 'Invalid Query Parameters',
            fields: z.flattenError(result.error).fieldErrors,
        });
    }
    return ok(result.data);
}
