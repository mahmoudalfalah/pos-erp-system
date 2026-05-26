import type { LucideIcon } from "lucide-react";
import type { Role } from "@/generated/prisma";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: Role[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type SidebarConfigs = {
  navMain: NavItem[];
  navGroups: NavGroup[];
};