import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { LoadingScreen as Loading } from "@/components/LoadingScreen";

export default function AuthLayout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
}
