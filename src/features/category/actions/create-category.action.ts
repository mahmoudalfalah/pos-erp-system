'use server';

import { validateCreateCategoryInput } from '../validators/create-category.validator';
import { createCategory } from '../services/create-category.service';
import { ok, fail, type Result } from '@/types/result.type';
import { CategoryMapper } from '../mappers/category.mapper';
import type { CategoryDto } from '../dtos/category.dto';
import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { Role } from '@/features/auth/types/role.types';

export const createCategoryAction = async (data: unknown): Promise<Result<CategoryDto>> => {
    const isAuthorized = await authorizeAction([Role.ADMIN, Role.MANAGER]);

    if (!isAuthorized.success) {
        return isAuthorized;
    }

    try {
        const validatedResult = validateCreateCategoryInput(data);
        if (!validatedResult.success) {
            return validatedResult;
        }

        const result = await createCategory(validatedResult.data);

        if (!result.success) {
            return result;
        }

        return ok(CategoryMapper.toDto(result.data));
    } catch (e) {
        console.error('Error in createCategoryAction:', e);
        return fail({
            code: 'UNEXPECTED',
            message: 'An unexpected error occurred while creating the category',
        });
    }
};
