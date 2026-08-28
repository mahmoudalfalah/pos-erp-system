export type Product = {
    id: string;
    name: string;
    slug: string;
    sku: string;
    barcode: string | null;
    description: string | null;
    currentPrice: number;
    currentCost: number;
    isActive: boolean;
    categoryId: string;
    brandId: string | null;
    createdAt: Date;
    updatedAt: Date;
};
