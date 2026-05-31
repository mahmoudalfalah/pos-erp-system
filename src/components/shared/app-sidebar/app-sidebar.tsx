"use client";

import { MonitorPlay } from "lucide-react";
import SidebarNav from "./sidebar-nav";
import NavGroups from "./nav-groups";
import UserMenu  from "./user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { SessionUser } from "@/features/auth/types/auth.types";
import type { SidebarConfigs } from "./app-sidebar.types";
import Link from "next/link";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & { user: SessionUser, configs: SidebarConfigs };

const AppSidebar = ({ user, configs, ...props }: AppSidebarProps) => {
 

  return (
    <Sidebar {...props}>
      <SidebarHeader>
      <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MonitorPlay className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">POS System</span>
                  <span className="truncate text-xs">Control Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {configs.navMain.length > 0 && <SidebarNav items={configs.navMain} />}        
        <NavGroups groups={configs.navGroups} />
      </SidebarContent>

      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;