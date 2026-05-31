import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type SidebarConfigs = {
  navMain: NavItem[];
  navGroups: NavGroup[];
};