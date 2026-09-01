'use client';

import { useMemo } from 'react';

import type { SessionUser } from '@/features/auth/types/auth.types';
import AppSidebar from '@/components/shared/app-sidebar';

import { SIDEBAR_CONFIGS } from '../_configs/sidebar.configs';
import { getFilteredConfigs } from '../_utils/navigation';

const DashboardSidebar = ({ user }: { user: SessionUser }) => {
    /**
     * Client boundary for sidebar configuration.
     * SIDEBAR_CONFIGS contains Lucide icon references (non-serializable)
     * and cannot be passed through the server/client boundary.
     * Role filtering happens here rather than in the layout for this reason.
     */

    const filteredConfigs = useMemo(
        () => getFilteredConfigs({ userRole: user.role, configs: SIDEBAR_CONFIGS }),
        [user.role],
    );

    return <AppSidebar user={user} configs={filteredConfigs} variant="inset" />;
};

export default DashboardSidebar;
