import { useWatch, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';

import { DynamicField } from '@/components/shared/forms/dynamic-field/dynamic-field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getFieldConstraints, isFieldRequired } from '@/utils/zod.util';

import { GENERAL_INFORMATION_REGISTERED_FIELDS } from '../../configs/create-product/create-product-ui-cards.configs';
import type { GeneralInformationRegisteredField } from '../../types/create-product.type';
import {
    createProductSchema,
    type CreateProductInput,
    type CreateProductRawInput,
} from '../../validators/create-product.validator';

type CardFieldNames = GeneralInformationRegisteredField['name'];
type CardWatchedValues = Pick<CreateProductInput, CardFieldNames>;

export function GeneralInformationCard({
    register,
    errors,
    control,
}: {
    register: UseFormRegister<CreateProductRawInput>;
    errors: FieldErrors<CreateProductRawInput>;
    control: Control<CreateProductRawInput>;
}) {
    const fieldNames = GENERAL_INFORMATION_REGISTERED_FIELDS.map((f) => f.name);
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
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                    Define your product&apos;s core attributes and characteristics.
                </CardDescription>
            </CardHeader>
            <div className="px-4">
                <Separator />
            </div>
            <CardContent className="flex flex-col gap-4">
                {GENERAL_INFORMATION_REGISTERED_FIELDS.map((field) => {
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
                            {...counterObject}
                            startAdornment={field.startAdornment}
                        />
                    );
                })}
            </CardContent>
        </Card>
    );
}
