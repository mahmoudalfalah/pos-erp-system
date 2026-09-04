'use server';

import { Role } from '@/features/auth';
import { authorizeAction } from '@/features/auth/services/authorize-action.service';
import { fail, ok, Result } from '@/types/result.type';

import type { ProductDto } from '../dtos/product.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { createProduct } from '../services/create-product.service';
import {
    validateCreateProductInput,
    type CreateProductInput,
} from '../validators/create-product.validator';

export async function createProductAction(input: CreateProductInput): Promise<Result<ProductDto>> {
    const isAuthorized = await authorizeAction([Role.ADMIN, Role.MANAGER]);

    if (!isAuthorized.success) {
        return isAuthorized;
    }

    try {
        const validatedInput = validateCreateProductInput(input);

        if (!validatedInput.success) {
            return validatedInput;
        }

        const result = await createProduct(validatedInput.data);

        if (!result.success) {
            return result;
        }

        return ok(ProductMapper.toDto(result.data));
    } catch (e) {
        console.error('Failed to create product:', e);
        return fail({
            code: 'UNEXPECTED',
            message: 'Failed to create product',
        });
    }
}
