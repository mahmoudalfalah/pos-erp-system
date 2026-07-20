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

export type CategoryErrorCode = 
  | "CATEGORY_NOT_FOUND"
  | "CATEGORY_ALREADY_EXISTS";

// --- General ---
export type GeneralErrorCode =
  | "VALIDATION"
  | "UNEXPECTED"
  | "NOT_FOUND";

// --- The single union Result uses ---
export type AppErrorCode =
  | AuthErrorCode
  | ProductErrorCode
  | CategoryErrorCode
  | GeneralErrorCode;