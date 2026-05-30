import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import DashboardSidebar from './_components/dashboard-sidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user) redirect('/login');
  
  const sidebarStyles = {
    "--sidebar-width": "var(--sidebar-width-expanded)",
    "--header-height": "var(--header-height)",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyles}>
      <DashboardSidebar user={session.user} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}


export default DashboardLayout;