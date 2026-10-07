import { lazy, type ReactNode } from "react";
import { Navigate, type RouteObject } from "react-router";

import { AuthGuard, RoleGuard } from "@/auth/guard";
import AppLayout from "@/pages/app/layout";
import { paths } from "@/routes/paths";

const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const CustomerListPage = lazy(() => import("@/pages/Customers/List"));
const CustomerDetailPage = lazy(() => import("@/pages/Customers/Detail"));
const TransactionListPage = lazy(() => import("@/pages/Transactions/List"));
const TransactionDetailPage = lazy(() => import("@/pages/Transactions/Detail"));
const FailedPayoutsPage = lazy(() => import("@/pages/FailedPayouts"));
const FeeListPage = lazy(() => import("@/pages/Fees/List"));
const FeeFormPage = lazy(() => import("@/pages/Fees/Form"));
const SupportListPage = lazy(() => import("@/pages/Support/List"));
const SupportDetailPage = lazy(() => import("@/pages/Support/Detail"));
const StaffPage = lazy(() => import("@/pages/Staff"));
const AuditLogPage = lazy(() => import("@/pages/Logs/Audit"));
const WebhookPage = lazy(() => import("@/pages/Logs/Webhooks"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const SandboxPage = lazy(() => import("@/pages/Sandbox"));

const adminOnly = (element: ReactNode) => <RoleGuard roles={["Admin"]}>{element}</RoleGuard>;

export const mainRoutes: RouteObject[] = [
  { index: true, element: <Navigate replace to={paths.dashboard} /> },
  {
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { path: paths.dashboard, element: <DashboardPage /> },
      { path: paths.customers.root, element: <CustomerListPage /> },
      { path: paths.customers.match, element: <CustomerDetailPage /> },
      { path: paths.transactions.root, element: <TransactionListPage /> },
      { path: paths.transactions.match, element: <TransactionDetailPage /> },
      { path: paths.failedPayouts, element: <FailedPayoutsPage /> },
      { path: paths.fees.root, element: <FeeListPage /> },
      { path: paths.fees.new, element: adminOnly(<FeeFormPage />) },
      { path: paths.fees.editMatch, element: adminOnly(<FeeFormPage />) },
      { path: paths.support.root, element: <SupportListPage /> },
      { path: paths.support.match, element: <SupportDetailPage /> },
      { path: paths.logs, element: <Navigate replace to={paths.webhooks} /> },
      { path: paths.webhooks, element: <WebhookPage /> },
      { path: paths.auditLogs, element: adminOnly(<AuditLogPage />) },
      { path: paths.staff, element: adminOnly(<StaffPage />) },
      { path: paths.settings, element: adminOnly(<SettingsPage />) },
      { path: paths.sandbox, element: adminOnly(<SandboxPage />) },
    ],
  },
];
