import type { Category } from "../types/category.type";

export type CategoryDto = Omit<Category, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
}