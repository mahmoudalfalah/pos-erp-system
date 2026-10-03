import { useWatch, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';

import { DynamicField } from '@/components/shared/forms/dynamic-field/dynamic-field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getFieldConstraints, isFieldRequired } from '@/utils/zod.util';

import { FINANCE_REGISTERED_FIELDS } from '../../configs/create-product/create-product-ui-cards.configs';
import type { FinanceRegisteredField } from '../../types/create-product.type';
import {
    createProductSchema,
    type CreateProductInput,
    type CreateProductRawInput,
} from '../../validators/create-product.validator';

type CardFieldNames = FinanceRegisteredField['name'];
type CardWatchedValues = Pick<CreateProductInput, CardFieldNames>;

export function FinanceCard({
    register,
    errors,
    control,
}: {
    register: UseFormRegister<CreateProductRawInput>;
    errors: FieldErrors<CreateProductRawInput>;
    control: Control<CreateProductRawInput>;
}) {
    const fieldNames = FINANCE_REGISTERED_FIELDS.map((f) => f.name);
    const watchedArray = useWatch({
        control,
        name: fieldNames,
    });

    const watchedValues = fieldNames.reduce((acc, name, index) => {
        acc[name] = watchedArray[index];
        return acc;
    }, {} as Partial<CardWatchedValues>);

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
                    const maxLength = getFieldConstraints(schemaShape).maxLength;
                    const currentLength = watchedValues[field.name]?.length;
                    const counterObject = maxLength
                        ? {
                              currentLength,
                              maxLength,
                          }
                        : {};
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
                            startAddon={field.startAddOn}
                            endAddon={field.endAddOn}
                            {...counterObject}
                        />
                    );
                })}
            </CardContent>
        </Card>
    );
}
