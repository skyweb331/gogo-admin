import { useMemo } from "react";
import { useLocation, useParams as useRouterParams, useSearchParams as useRouterSearchParams } from "react-router";

export { useRouter } from "./useRouter";
export { useGridQuery } from "./useGridQuery";

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  const [searchParams] = useRouterSearchParams();
  return useMemo(() => searchParams, [searchParams]);
}

export function useParams<T extends string = string>() {
  return useRouterParams<T>();
}
