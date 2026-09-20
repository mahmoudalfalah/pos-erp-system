import { z } from 'zod';

export const emptyToUndefined = z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional();

export function getBaseSchema(schema: z.core.$ZodType): z.core.$ZodType {
    if (
        schema instanceof z.ZodOptional ||
        schema instanceof z.ZodDefault ||
        schema instanceof z.ZodNullable
    ) {
        return getBaseSchema(schema.unwrap());
    }

    return schema;
}

export function isFieldRequired(schema: z.core.$ZodType): boolean {
    if (
        schema instanceof z.ZodOptional ||
        schema instanceof z.ZodNullable ||
        schema instanceof z.ZodDefault
    ) {
        return false;
    }

    if (schema instanceof z.ZodPipe) {
        return isFieldRequired(schema.in) && isFieldRequired(schema.out);
    }

    return true;
}

type FieldConstraints = Partial<{
    maxLength: number;
}>;

export function getFieldConstraints(schema: z.core.$ZodType): FieldConstraints {
    if (schema instanceof z.ZodPipe) {
        return {
            ...getFieldConstraints(schema.in),
            ...getFieldConstraints(schema.out),
        };
    }

    const baseSchema = getBaseSchema(schema);
    const constraints: FieldConstraints = {};

    if (baseSchema instanceof z.ZodString) {
        if (baseSchema.maxLength) {
            constraints.maxLength = baseSchema.maxLength;
        }
    }

    return constraints;
}
