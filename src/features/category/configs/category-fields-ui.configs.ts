import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type { CreateCategoryRegisteredField } from '../types/create-category.type';

export const CATEGORY_REGISTERED_FIELDS: CreateCategoryRegisteredField[] = [
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
