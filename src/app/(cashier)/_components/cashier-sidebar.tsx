"use client";

import { SIDEBAR_CONFIGS } from "../_configs/sidebar.configs";
import AppSidebar from "@/components/shared/app-sidebar";
import type { SessionUser } from "@/features/auth/types/auth.types";



const CashierSidebar = ({ user }: { user: SessionUser }) => {
    
    /**
     * Client boundary for sidebar configuration.
     * SIDEBAR_CONFIGS contains Lucide icon references (non-serializable)
     * and cannot be passed through the server/client boundary.
     * Role filtering happens here rather than in the layout for this reason.
     */

    return (
        <AppSidebar user={user} configs={SIDEBAR_CONFIGS} collapsible="icon" variant="floating" />
    );
}

export default CashierSidebar;