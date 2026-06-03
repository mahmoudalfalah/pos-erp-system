import type { FilterSidebarParams, DashboardNavItem } from "../_types/dashboard-sidebar.types";
import type { NavItem } from "@/components/shared/app-sidebar";
import type { Role } from "@/features/auth";

const filterAndStripRoles = (items: DashboardNavItem[], userRole: Role): NavItem[] => {
    const processedItems: NavItem[] = [];
    
    for (const item of items) {
        if (item.roles.includes(userRole)) {
            const { roles: _, ...safeItem } = item;
            processedItems.push(safeItem);
        }
    }
    
    return processedItems;
};

export const getFilteredConfigs = ({ userRole, configs }: FilterSidebarParams) => {
    const navMain = filterAndStripRoles(configs.navMain, userRole);

    const navGroups = [];
    
    for (const group of configs.navGroups) {
        const filteredItems = filterAndStripRoles(group.items, userRole);
        
        if (filteredItems.length > 0) {
            navGroups.push({
                label: group.label,
                items: filteredItems,
            });
        }
    }

    return {
        navMain,
        navGroups
    };
};