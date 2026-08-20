'use server';

import { revalidatePath } from 'next/cache';
import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { updateCategory } from '../services/update-category.service';
import { ok, fail } from '@/types/result.type';
import { Role } from '@/features/auth/types/role.types';
import { validateUpdateCategoryInput } from '../validators/update-category.validator';
import { CategoryMapper } from '../mappers/category.mapper';

export async function updateCategoryAction(id: string, payload: unknown) {
    const isAuthorized = await authorizeAction([Role.ADMIN, Role.MANAGER]);

    if (!isAuthorized.success) {
        return isAuthorized;
    }

    try {
        const validatedResult = validateUpdateCategoryInput(payload);
        if (!validatedResult.success) {
            return validatedResult;
        }

        const result = await updateCategory(id, validatedResult.data);

        if (!result.success) {
            return result;
        }

        revalidatePath('/dashboard/categories');

        return ok(CategoryMapper.toDto(result.data));
    } catch (e) {
        console.error('Error in updateCategoryAction:', e);
        return fail({
            code: 'UNEXPECTED',
            message: 'An unexpected error occurred while updating the category',
        });
    }
}
