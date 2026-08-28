import type { Product } from '../types/product.type';

export type ProductDto = Omit<
    Product,
    'barcode' | 'description' | 'brandId' | 'createdAt' | 'updatedAt'
> & {
    barcode?: string;
    description?: string;
    brandId?: string;
    createdAt: string;
    updatedAt: string;
};
