import {
  LayoutDashboard,
  Package,
  Tags,
  ArrowDownToLine,
  Truck,
  Receipt,
  BarChart4,
  Users,
  Settings,
} from "lucide-react";
import { Role } from "@/generated/prisma";
import type { SidebarConfigs } from "../_types/sidebar.types";




export const SIDEBAR_CONFIGS: SidebarConfigs = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: [Role.ADMIN, Role.MANAGER],
    },
  ],
  navGroups: [
    {
      label: "Catalog & Inventory",
      items: [
        { title: "Products", url: "/dashboard/products", icon: Package, roles: [Role.ADMIN, Role.MANAGER] },
        { title: "Categories & Brands", url: "/dashboard/categories", icon: Tags, roles: [Role.ADMIN, Role.MANAGER] },
        { title: "Stock Receipts", url: "/dashboard/stock", icon: ArrowDownToLine, roles: [Role.ADMIN, Role.MANAGER] },
      ],
    },
    {
      label: "Supply Chain",
      items: [
        { title: "Suppliers", url: "/dashboard/suppliers", icon: Truck, roles: [Role.ADMIN, Role.MANAGER] },
        { title: "Invoices", url: "/dashboard/invoices", icon: Receipt, roles: [Role.ADMIN, Role.MANAGER] },
      ],
    },
    {
      label: "Insights",
      items: [
        { title: "Reports", url: "/dashboard/reports", icon: BarChart4, roles: [Role.ADMIN, Role.MANAGER] },
      ],
    },
    {
      label: "Administration",
      items: [
        { title: "Staff Management", url: "/dashboard/staff", icon: Users, roles: [Role.ADMIN] },
        { title: "System Settings", url: "/dashboard/settings", icon: Settings, roles: [Role.ADMIN] },
      ],
    },
  ],
};