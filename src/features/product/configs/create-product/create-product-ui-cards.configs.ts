import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type {
    FinanceRegisteredField,
    GeneralInformationRegisteredField,
} from '../../types/create-product.type';

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

export const FINANCE_REGISTERED_FIELDS: FinanceRegisteredField[] = [
    {
        id: 'currentPrice',
        name: 'currentPrice',
        label: 'Current Price',
        placeholder: 'Current Price',
        kind: Input,
        helperText: 'The final selling price.',
        startAddon: process.env.NEXT_PUBLIC_APP_CURRENCY_SYMBOL,
        endAddon: process.env.NEXT_PUBLIC_APP_CURRENCY,
    },
    {
        id: 'currentCost',
        name: 'currentCost',
        label: 'Current Cost',
        placeholder: 'Current Cost',
        kind: Input,
        helperText:
            'The internal cost to acquire or produce the item. Used to calculate profit margins.',
        startAddon: process.env.NEXT_PUBLIC_APP_CURRENCY_SYMBOL,
        endAddon: process.env.NEXT_PUBLIC_APP_CURRENCY,
    },
];
