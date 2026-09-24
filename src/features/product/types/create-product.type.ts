import type { Input } from '@/components/ui/input';
import type { Textarea } from '@/components/ui/textarea';

import type { CreateProductInput } from '../validators/create-product.validator';

type ProductRegistryFields<TKey extends keyof CreateProductInput> = Readonly<{
    id: string;
    name: TKey;
    label: string;
    placeholder: string;
    kind: typeof Input | typeof Textarea;
    helperText: string;
    startAdornment?: string;
}>;

export type GeneralInformationRegisteredField = ProductRegistryFields<
    'name' | 'slug' | 'description'
>;
