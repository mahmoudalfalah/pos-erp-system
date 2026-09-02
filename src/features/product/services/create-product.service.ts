import { db } from '@/lib/db';
import { getPrismaUniqueFields } from '@/utils/prisma-errors.util';
import { fail, ok, type Result } from '@/types/result.type';

import { ProductMapper } from '../mappers/product.mapper';
import type { Product } from '../types/product.type';
import type { CreateProductInput } from '../validators/create-product.validator';

export async function createProduct(input: CreateProductInput): Promise<Result<Product>> {
    try {
        const rawProduct = await db.product.create({
            data: ProductMapper.toPrismaCreate(input),
        });
        return ok(ProductMapper.toDomain(rawProduct));
    } catch (e) {
        const uniqueFields = getPrismaUniqueFields(e);
        if (uniqueFields) {
            const fields: Record<string, string[]> = {};
            if (uniqueFields.includes('slug')) {
                fields.slug = [`Product with slug "${input.slug}" already exists.`];
            }
            if (uniqueFields.includes('sku')) {
                fields.sku = [`Product with sku "${input.sku}" already exists.`];
            }
            if (uniqueFields.includes('barcode')) {
                fields.barcode = [`Product with barcode "${input.barcode}" already exists.`];
            }
            return fail({
                code: 'PRODUCT_ALREADY_EXISTS',
                message: 'A product with the same unique fields already exists.',
                fields,
            });
        }
        return fail({
            code: 'UNEXPECTED',
            message: 'An unexpected error occurred while creating the product',
        });
    }
}
