import { z } from 'zod';
import { ok, fail, type Result } from '@/types/result.type';
import { idSchema } from '@/validators/id.validator';

const deleteCategoriesSchema = z.array(idSchema).min(1);

export const validateDeleteCategories = (ids: unknown): Result<{ ids: string[] }> => {
  const result = deleteCategoriesSchema.safeParse(ids);
  if (!result.success) {
    return fail({
      code: 'VALIDATION',
      message: 'Invalid Category IDs',
    });
  }
  return ok({ ids: result.data });
};
