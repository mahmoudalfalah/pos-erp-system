'use client';

import { useRef } from 'react';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { mergeRefs } from '@/utils/merge-refs.util';

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
    helperText,
    startAdornment,
    startAddon: StartAddon,
    endAddon: EndAddon,
    ...rest
}: DynamicFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const { ref, ...restRegisterProps } = registerProps;

    const mergedRefs = mergeRefs(ref, inputRef);

    return (
        <Field>
            <div className="flex items-center justify-between">
                <FieldLabel className="items-baseline gap-1" htmlFor={id}>
                    {label}{' '}
                    {required ? (
                        <span className="text-red-600">*</span>
                    ) : (
                        <span className="text-2xs font-normal text-muted-foreground">
                            (Optional)
                        </span>
                    )}
                </FieldLabel>
                {typeof currentLength === 'number' && (
                    <Typography className="text-sm text-muted-foreground">
                        {String(currentLength)} / {maxLength} Characters
                    </Typography>
                )}
            </div>
            <div
                className={cn(
                    'flex w-full min-w-0 items-baseline overflow-hidden rounded-lg border border-input',
                    'bg-transparent text-base transition-colors outline-none',
                    'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
                    'placeholder:text-muted-foreground',

                    'has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50',

                    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50',
                    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
                    'md:text-sm',
                    'dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
                )}
                onClick={() => inputRef.current?.focus()}
                aria-invalid={!!errorMessage}
            >
                {startAdornment && <div className="px-2.5 py-1">{startAdornment}</div>}
                <div className={cn('flex items-center', 'flex-1 bg-background dark:bg-background')}>
                    {StartAddon &&
                        (typeof StartAddon == 'string' ? (
                            <Typography variant="caption" className="px-2.5 py-1">
                                {StartAddon}
                            </Typography>
                        ) : (
                            <StartAddon size={16} className="mx-2.5 my-1" />
                        ))}
                    <Component
                        id={id}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        className={cn(
                            'flex-1 rounded-none border-0 bg-background shadow-none ring-0 outline-none dark:bg-background',
                            'focus-visible:ring-0 focus-visible:ring-offset-0',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            StartAddon && 'px-0',
                        )}
                        ref={mergedRefs}
                        {...restRegisterProps}
                        {...rest}
                    />
                    {EndAddon &&
                        (typeof EndAddon == 'string' ? (
                            <Typography variant="caption" className="px-2.5 py-1">
                                {EndAddon}
                            </Typography>
                        ) : (
                            <EndAddon size={16} className="mx-2.5 my-1" />
                        ))}
                </div>
            </div>
            {errorMessage ? (
                <FieldError className="text-xs">{errorMessage}</FieldError>
            ) : helperText ? (
                <Typography variant="caption" className="text-muted-foreground">
                    {helperText}
                </Typography>
            ) : null}
        </Field>
    );
}
