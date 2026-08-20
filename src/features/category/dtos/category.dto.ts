import type { Category } from '../types/category.type';

export type CategoryDto = Omit<Category, 'description' | 'createdAt' | 'updatedAt'> & {
    description?: string;
    createdAt: string;
    updatedAt: string;
};
