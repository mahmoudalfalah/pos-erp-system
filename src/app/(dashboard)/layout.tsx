import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "./_components/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Role } from '@/generated/prisma';


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user) redirect('/login');

  if (session.user.role === Role.CASHIER) redirect('/pos');

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "var(--sidebar-width-expanded)",
          "--header-height": "var(--header-height)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar user={session.user} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}


export default DashboardLayout;