import type { ElementType, InputHTMLAttributes } from 'react';
import type { UseFormProps } from 'react-hook-form';

export type DynamicFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    placeholder: string;
    errorMessage?: string;
    registerProps: UseFormProps;
    component: ElementType;
};
