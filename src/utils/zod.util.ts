import { z } from 'zod';

export const emptyToUndefined = z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional();
