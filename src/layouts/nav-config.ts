import { CONFIG } from "@/config";
import { paths } from "@/routes/paths";
import { MenuItem } from "@/types/types";

export const leftMenuItems: MenuItem[] = [
  { id: "dashboard", icon: "NiDashboard", label: "menu-dashboard", color: "text-primary", href: paths.dashboard },
  { id: "customers", icon: "NiUsers", label: "menu-customers", color: "text-primary", href: paths.customers.root },
  {
    id: "transactions",
    icon: "NiArrowLeftRight",
    label: "menu-transactions",
    color: "text-primary",
    href: paths.transactions.root,
  },
  {
    id: "failed-payouts",
    icon: "NiExclamationSquare",
    label: "menu-failed-payouts",
    color: "text-primary",
    href: paths.failedPayouts,
  },
  { id: "fees", icon: "NiPercent", label: "menu-fees", color: "text-primary", href: paths.fees.root },
  { id: "support", icon: "NiMessages", label: "menu-support", color: "text-primary", href: paths.support.root },
  {
    id: "logs",
    icon: "NiPulse",
    label: "menu-logs",
    color: "text-primary",
    href: paths.logs,
    children: [
      { id: "webhooks", label: "menu-webhooks", href: paths.webhooks, icon: "NiDocumentCode" },
      { id: "audit-logs", label: "menu-audit-logs", href: paths.auditLogs, icon: "NiShieldCheck", roles: ["Admin"] },
    ],
  },
];

export const leftMenuBottomItems: MenuItem[] = [
  { id: "staff", label: "menu-staff", href: paths.staff, icon: "NiUser", roles: ["Admin"] },
  { id: "settings", label: "menu-settings", href: paths.settings, icon: "NiSettings", roles: ["Admin"] },
  {
    id: "sandbox",
    label: "menu-sandbox",
    href: paths.sandbox,
    icon: "NiFlask",
    roles: ["Admin"],
    hideInMenu: !CONFIG.SANDBOX,
  },
];
