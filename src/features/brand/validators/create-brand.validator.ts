import { z } from 'zod';

import { emptyToUndefined } from '@/utils/zod.util';
import { fail, ok, type Result } from '@/types/result.type';

export const createBrandSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Brand name is required')
        .max(40, 'Brand name must be at most 40 characters long'),
    description: emptyToUndefined.pipe(
        z
            .string()
            .trim()
            .max(255, 'Brand description must be at most 255 characters long')
            .optional(),
    ),
    slug: z
        .string()
        .trim()
        .min(1, 'Brand slug is required')
        .max(40, 'Brand slug must be at most 40 characters long')
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Brand slug must be URL-friendly (lowercase letters, numbers, and hyphens only)',
        ),
    isActive: z.boolean().default(true),
});

export type CreateBrandInput = z.output<typeof createBrandSchema>;
export type CreateBrandFormInput = z.input<typeof createBrandSchema>;

export const validateCreateBrandInput = (data: unknown): Result<CreateBrandInput> => {
    const result = createBrandSchema.safeParse(data);
    if (!result.success) {
        return fail({
            code: 'VALIDATION',
            message: 'Invalid input data',
            fields: z.flattenError(result.error).fieldErrors,
        });
    }
    return ok(result.data);
};
