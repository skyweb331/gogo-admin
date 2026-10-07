import { authRoutes } from "./auth";
import { mainRoutes } from "./main";
import { lazy } from "react";
import type { RouteObject } from "react-router";

const Page404 = lazy(() => import("@/pages/Error/404"));

export const routesSection: RouteObject[] = [
  // Auth
  ...authRoutes,

  // Console
  ...mainRoutes,

  // No match
  { path: "*", element: <Page404 /> },
];
