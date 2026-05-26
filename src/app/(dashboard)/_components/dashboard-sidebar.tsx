"use client";

import { MonitorPlay } from "lucide-react";
import SidebarNav from "./sidebar-nav";
import NavGroups from "./nav-groups";
import UserMenu  from "./user-menu";
import { SIDEBAR_CONFIGS } from "../_configs/sidebar.configs";
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

type DashboardSidebarProps = React.ComponentProps<typeof Sidebar> & { user: SessionUser }

const DashboardSidebar = ({ user, ...props }: DashboardSidebarProps) => {
  const filteredNavMain = SIDEBAR_CONFIGS.navMain.filter((item) =>
    item.roles.includes(user.role)
  );

  const filteredGroups = SIDEBAR_CONFIGS.navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(user.role)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MonitorPlay className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">POS System</span>
                  <span className="truncate text-xs">Control Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {filteredNavMain.length > 0 && <SidebarNav items={filteredNavMain} />}        
        <NavGroups groups={filteredGroups} />
      </SidebarContent>

      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default DashboardSidebar;