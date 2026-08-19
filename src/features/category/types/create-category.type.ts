import type { CreateCategoryInput } from '../validators/create-category.validator';
import type { Input } from '@/components/ui/input';
import type { Textarea } from '@/components/ui/textarea';

export type CreateCategoryRegisteredField = Readonly<{
    id: string;
    name: Exclude<keyof CreateCategoryInput, 'isActive'>;
    label: string;
    placeholder: string;
    kind: typeof Input | typeof Textarea;
}>;
