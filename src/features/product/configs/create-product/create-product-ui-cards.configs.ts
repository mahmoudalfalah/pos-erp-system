import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type { GeneralInformationRegisteredField } from '../../types/create-product.type';

export const GENERAL_INFORMATION_REGISTERED_FIELDS: GeneralInformationRegisteredField[] = [
    {
        id: 'name',
        name: 'name',
        label: 'Product Name',
        placeholder: 'Product Name',
        kind: Input,
        helperText: 'Between 1 and 100 characters. Shown as the primary title',
    },
    {
        id: 'slug',
        name: 'slug',
        label: 'URL Slug',
        placeholder: 'pos-er-34x',
        kind: Input,
        helperText: 'URL-friendly: lowercase letters, numbers, and hyphens only',
        startAdornment: `${process.env.NEXT_PUBLIC_APP_DOMAIN}/products/`,
    },
    {
        id: 'description',
        name: 'description',
        label: 'Description',
        placeholder: 'Product Description',
        kind: Textarea,
        helperText: 'Up to 500 characters.',
    },
];
