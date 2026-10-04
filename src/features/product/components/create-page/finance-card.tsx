import { type FieldErrors, type UseFormRegister } from 'react-hook-form';

import { DynamicField } from '@/components/shared/forms/dynamic-field/dynamic-field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { isFieldRequired } from '@/utils/zod.util';

import { FINANCE_REGISTERED_FIELDS } from '../../configs/create-product/create-product-ui-cards.configs';
import {
    createProductSchema,
    type CreateProductRawInput,
} from '../../validators/create-product.validator';

export function FinanceCard({
    register,
    errors,
}: {
    register: UseFormRegister<CreateProductRawInput>;
    errors: FieldErrors<CreateProductRawInput>;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pricing & Finance</CardTitle>
                <CardDescription>Standard customer pricing and cost information.</CardDescription>
            </CardHeader>
            <div className="px-4">
                <Separator />
            </div>
            <CardContent className="flex items-center justify-between gap-4">
                {FINANCE_REGISTERED_FIELDS.map((field) => {
                    const schemaShape = createProductSchema.shape[field.name];
                    return (
                        <DynamicField
                            key={field.id}
                            id={field.id}
                            label={field.label}
                            placeholder={field.placeholder}
                            registerProps={register(field.name)}
                            errorMessage={errors[field.name]?.message}
                            component={field.kind}
                            helperText={field.helperText}
                            required={isFieldRequired(schemaShape)}
                            startAddon={field.startAddon}
                            endAddon={field.endAddon}
                        />
                    );
                })}
            </CardContent>
        </Card>
    );
}
