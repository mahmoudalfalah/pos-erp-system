import type { AppErrorCode } from "./error.type";

export type AppError = {
    code: AppErrorCode;
    message: string;
    fields?: Record<string, string[]>;
};

export type Result<T = void> =
    | { success: true; data: T }
    | { success: false; error: AppError };

export const ok = <T>(data: T): Result<T> => ({ success: true, data });
export const fail = (error: AppError): Result<never> => ({ success: false, error });