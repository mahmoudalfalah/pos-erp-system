import {
  ShoppingCart,
  ReceiptText,
  Undo2,
  Users,
  MonitorStop,
  Clock,
  PauseCircle
} from "lucide-react";
import type { SidebarConfigs } from "@/components/shared/app-sidebar"; 

export const SIDEBAR_CONFIGS: SidebarConfigs = {
  navMain: [
    {
      title: "Point of Sale",
      url: "/pos",
      icon: ShoppingCart,
    },
  ],
  navGroups: [
    {
      label: "Transactions",
      items: [
        { title: "Recent Sales", url: "/pos/sales", icon: ReceiptText },
        { title: "Parked Sales", url: "/pos/drafts", icon: PauseCircle }, 
        { title: "Returns & Refunds", url: "/pos/returns", icon: Undo2 },
      ],
    },
    {
      label: "Customer Management",
      items: [
        { title: "Customer Directory", url: "/pos/customers", icon: Users },
      ],
    },
    {
      label: "Shift & Register",
      items: [
        { title: "Cash Drawer", url: "/pos/drawer", icon: MonitorStop },
        { title: "Shift History", url: "/pos/shifts", icon: Clock },
      ],
    },
  ],
};