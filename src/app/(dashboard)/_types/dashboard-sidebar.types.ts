import type { Role } from "@/features/auth"
import type { NavItem } from "@/components/shared/app-sidebar";

export type DashboardNavItem = NavItem & { 
  roles: Role[]; 
};

export type DashboardNavGroup = {
  label: string;
  items: DashboardNavItem[];
};

export type DashboardSidebarConfigs = {
  navMain: DashboardNavItem[];
  navGroups: DashboardNavGroup[];
};

export type FilterSidebarParams = {
  userRole: Role;
  configs: DashboardSidebarConfigs;
}