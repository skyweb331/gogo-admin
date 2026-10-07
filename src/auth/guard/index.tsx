import { useAuthContext } from "../hooks";
import type { StaffRole } from "../types";
import { safeReturnUrl } from "../utils";
import { Navigate, useLocation } from "react-router";

import { Alert, AlertTitle, Box } from "@mui/material";

import { LoadingScreen } from "@/components/LoadingScreen";
import { CONFIG } from "@/config";
import NiExclamationSquare from "@/icons/nexture/ni-exclamation-square";
import { useSearchParams } from "@/routes/hooks";
import { paths } from "@/routes/paths";

type Props = { children: React.ReactNode };

/** Signed-in staff only; others go to sign-in with `returnTo`. */
export function AuthGuard({ children }: Props) {
  const { isAuthenticated, loading } = useAuthContext();
  const { pathname, search } = useLocation();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) {
    return <Navigate replace to={`${paths.auth.signIn}?returnTo=${encodeURIComponent(pathname + search)}`} />;
  }
  return <>{children}</>;
}

/** Guests only (sign-in, forgot password); signed-in staff continue to `returnTo`. */
export function GuestGuard({ children }: Props) {
  const { isAuthenticated, loading } = useAuthContext();
  const searchParams = useSearchParams();

  if (loading) return <LoadingScreen />;
  if (isAuthenticated) {
    return <Navigate replace to={safeReturnUrl(searchParams.get("returnTo"), CONFIG.redirectPath)} />;
  }
  return <>{children}</>;
}

/**
 * Inside AuthGuard. Hides pages from roles that can't use them; the API enforces the same rules.
 * `fallback="hide"` renders nothing, for buttons and panels inside a page.
 */
export function RoleGuard({
  roles,
  children,
  fallback = "page",
}: Props & { roles: StaffRole[]; fallback?: "page" | "hide" }) {
  const { user } = useAuthContext();
  if (user && roles.includes(user.role as StaffRole)) return <>{children}</>;
  if (fallback === "hide") return null;
  return (
    <Box className="p-4">
      <Alert severity="warning" icon={<NiExclamationSquare />} className="neutral bg-background-paper/60!">
        <AlertTitle variant="subtitle2">You don't have access to this page</AlertTitle>
        It needs the {roles.join(" or ")} role. Ask an administrator if you need it.
      </Alert>
    </Box>
  );
}
