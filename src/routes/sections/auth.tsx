import { lazy } from "react";
import type { RouteObject } from "react-router";

import { GuestGuard } from "@/auth/guard";
import AuthLayout from "@/pages/auth/layout";

const SignInPage = lazy(() => import("@/pages/SignIn"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPassword"));

export const authRoutes: RouteObject[] = [
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: (
          <GuestGuard>
            <SignInPage />
          </GuestGuard>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <GuestGuard>
            <ForgotPasswordPage />
          </GuestGuard>
        ),
      },
      // Password reset and staff invites; reachable signed in or out
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },
];
