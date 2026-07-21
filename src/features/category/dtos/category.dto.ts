import type { Category } from "../types/category.type";

export type CategoryDTO = Omit<Category, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
}