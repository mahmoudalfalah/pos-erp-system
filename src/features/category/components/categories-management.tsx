"use client";

import { useState } from "react";
import CreateCategoryDialog from "./create-category-dialog";
import { CategoriesGrid } from "./categories-grid";

export function CategoriesManagement() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="p-10">
            <CreateCategoryDialog onCreated={
                () => setRefreshKey(prev => prev + 1)} 
            />
            <CategoriesGrid refreshKey={refreshKey} />
        </div>
    )
}