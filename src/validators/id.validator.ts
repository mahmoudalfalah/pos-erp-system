import { z } from 'zod';
import { ok, fail, Result } from '@/types/result.type';

export const idSchema = z.string().min(1);

export const validateId = (id: unknown): Result<string> => {
    const result = idSchema.safeParse(id);
    if (!result.success) {
        return fail({
            code: 'VALIDATION',
            message: 'Invalid ID',
        });
    }
    return ok(result.data);
};
