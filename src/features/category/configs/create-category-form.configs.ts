import type { CreateCategoryInput } from '../validators/create-category.validator';
import type { CreateCategoryRegisteredField } from '../types/create-category.type';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const CREATE_CATEGORY_REGISTERED_FIELDS: CreateCategoryRegisteredField[] = [
    {
        id: 'name',
        name: 'name',
        label: 'Category Name',
        placeholder: 'Enter category name',
        kind: Input,
    },
    {
        id: 'slug',
        name: 'slug',
        label: 'Category Slug',
        placeholder: 'Enter category slug',
        kind: Input,
    },
    {
        id: 'description',
        name: 'description',
        label: 'Category Description',
        placeholder: 'Enter category description',
        kind: Textarea,
    },
];

export const CREATE_CATEGORY_FORM_DEFAULT_VALUES: CreateCategoryInput = {
    name: '',
    slug: '',
    description: '',
    isActive: true,
};
