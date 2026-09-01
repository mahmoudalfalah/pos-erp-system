import { redirect } from 'next/navigation';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/auth';

import CashierSidebar from './_components/cashier-sidebar';

const CashierLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    if (!session?.user) redirect('/login');

    const sidebarStyles = {
        '--sidebar-width': 'var(--sidebar-width-expanded)',
        '--header-height': 'var(--header-height)',
    } as React.CSSProperties;

    return (
        <SidebarProvider style={sidebarStyles}>
            <CashierSidebar user={session.user} />
            <SidebarInset className="flex h-screen flex-col gap-3 p-2">{children}</SidebarInset>
        </SidebarProvider>
    );
};

export default CashierLayout;
