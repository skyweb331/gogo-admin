import type { FetchMeQuery, UserRole } from "@/__generated__/graphql";

export type Me = FetchMeQuery["me"];
export type StaffRole = Exclude<UserRole, "Customer">;

export type AuthContextValue = {
  user: Me | null;
  /** Admins can edit fees, staff, settings and payouts; Support is read-mostly. */
  isAdmin: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  refetch: () => Promise<void>;
};
