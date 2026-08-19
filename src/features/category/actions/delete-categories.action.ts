'use server';

import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { deleteCategories } from '../services/delete-categories.service';
import { Role } from '@/features/auth/types/role.types';
import { fail, type Result } from '@/types/result.type';
import { validateDeleteCategories } from '../validators/delete-categories.validator';

export async function deleteCategoriesAction(ids: unknown): Promise<Result<{ ids: string[] }>> {
  try {
    const isAuthorized = await authorizeAction([Role.ADMIN, Role.MANAGER]);
    if (!isAuthorized.success) {
      return isAuthorized;
    }

    const validatedIds = validateDeleteCategories(ids);
    if (!validatedIds.success) {
      return validatedIds;
    }
    return await deleteCategories(validatedIds.data.ids);
  } catch (e) {
    console.error('Error in deleteCategoriesAction:', e);
    return fail({
      code: 'UNEXPECTED',
      message: 'An unexpected error occurred while deleting the categories',
    });
  }
}
