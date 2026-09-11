import type { ElementType, InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type MainFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'maxLength'> & {
    id: string;
    label: string;
    placeholder: string;
    errorMessage?: string;
    registerProps: UseFormRegisterReturn;
    component: ElementType;
    required?: boolean;
    helperText?: string;
    startAdornment?: string;
};

type CounterProps =
    { currentLength?: never; maxLength?: number } | { currentLength: number; maxLength: number };

export type DynamicFieldProps = MainFieldProps & CounterProps;
