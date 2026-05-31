import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CashierSidebar from './_components/cashier-sidebar';

const CashierLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user) redirect('/login');
  
  const sidebarStyles = {
    "--sidebar-width": "var(--sidebar-width-expanded)",
    "--header-height": "var(--header-height)",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyles}>
      <CashierSidebar user={session.user} />
      <SidebarInset className="flex flex-col gap-3 p-2 h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CashierLayout;