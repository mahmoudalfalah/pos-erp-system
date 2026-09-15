import type { CreateCategoryInput } from '../validators/create-category.validator';

export const CATEGORY_FORM_DEFAULT_VALUES: CreateCategoryInput = {
    name: '',
    slug: '',
    description: '',
    isActive: true,
};
