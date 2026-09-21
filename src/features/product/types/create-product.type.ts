import type { Input } from '@/components/ui/input';
import type { Textarea } from '@/components/ui/textarea';

import type { CreateProductInput } from '../validators/create-product.validator';

export type GeneralInformationRegisteredField = Readonly<{
    id: string;
    name: Extract<keyof CreateProductInput, 'name' | 'slug' | 'description'>;
    label: string;
    placeholder: string;
    kind: typeof Input | typeof Textarea;
    helperText: string;
    startAdornment?: string;
}>;
