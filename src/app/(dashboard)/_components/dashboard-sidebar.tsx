"use client";

import { useMemo } from "react";
import { SIDEBAR_CONFIGS } from "../_configs/sidebar.configs";
import AppSidebar from "@/components/shared/app-sidebar";
import type { SessionUser } from "@/features/auth/types/auth.types";



const DashboardSidebar = ({ user }: { user: SessionUser }) => {
    

    /**
     * Client boundary for sidebar configuration.
     * SIDEBAR_CONFIGS contains Lucide icon references (non-serializable)
     * and cannot be passed through the server/client boundary.
     * Role filtering happens here rather than in the layout for this reason.
     */

    const filteredConfigs = useMemo(() => {
        
        const filteredNavMain = SIDEBAR_CONFIGS.navMain.filter((item) =>
            item.roles.includes(user.role)
        )
        .map(({ roles, ...item }) => item);
    
        const filteredGroups = SIDEBAR_CONFIGS.navGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.roles.includes(user.role)),
        }))
        .filter((group) => group.items.length > 0)
        .map(({label, items}) => ({label, items: items.map(({roles, ...item}) => item)}));

        return {
            navMain: filteredNavMain,
            navGroups: filteredGroups
        }

    }, [user]);

    return (
        <AppSidebar user={user} configs={filteredConfigs} />
    );
}

export default DashboardSidebar;