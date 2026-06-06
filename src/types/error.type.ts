// --- Auth ---
export type AuthErrorCode =
  | "AUTH_UNAUTHORIZED"
  | "AUTH_FORBIDDEN"
  | "AUTH_USER_ALREADY_EXISTS"
  | "AUTH_INVALID_CREDENTIALS";

// --- Products ---
export type ProductErrorCode =
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_OUT_OF_STOCK"
  | "PRODUCT_INSUFFICIENT_STOCK";

// --- General ---
export type GeneralErrorCode =
  | "VALIDATION"
  | "UNEXPECTED"
  | "NOT_FOUND";

// --- The single union Result uses ---
export type AppErrorCode =
  | AuthErrorCode
  | ProductErrorCode
  | GeneralErrorCode;