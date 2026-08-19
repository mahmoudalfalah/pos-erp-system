'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import type { DynamicFieldProps } from './dynamic-field.type';

export function DynamicField({
    id,
    label,
    placeholder,
    errorMessage,
    registerProps,
    component: Component,
    ...rest
}: DynamicFieldProps) {
    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Component id={id} placeholder={placeholder} {...registerProps} {...rest} />
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </Field>
    );
}
