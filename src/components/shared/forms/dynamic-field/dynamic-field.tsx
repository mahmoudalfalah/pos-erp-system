'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Typography } from '@/components/ui/typography';

import type { DynamicFieldProps } from './dynamic-field.type';

export function DynamicField({
    id,
    label,
    placeholder,
    errorMessage,
    registerProps,
    maxLength,
    currentLength,
    required,
    component: Component,
    ...rest
}: DynamicFieldProps) {
    return (
        <Field>
            <div className="flex items-center justify-between">
                <FieldLabel htmlFor={id}>
                    {label} {required && <span className="text-red-600">*</span>}
                </FieldLabel>
                {typeof currentLength === 'number' && (
                    <Typography className="text-sm text-muted-foreground">
                        {String(currentLength)} / {maxLength} Characters
                    </Typography>
                )}
            </div>
            <Component
                id={id}
                placeholder={placeholder}
                maxLength={maxLength}
                {...registerProps}
                {...rest}
            />
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </Field>
    );
}
