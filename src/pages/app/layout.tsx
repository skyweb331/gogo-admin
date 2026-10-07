import "@/style/global.css";

import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { Box } from "@mui/material";

import Header from "@/components/layout/containers/header";
import Main from "@/components/layout/containers/main";
import LeftMenu from "@/components/layout/menu/left-menu";
import MenuBackdrop from "@/components/layout/menu/menu-backdrop";
import { LoadingScreen as Loading } from "@/components/LoadingScreen";
import { useThemeContext } from "@/theme/theme-provider";

export default function AppLayout() {
  const { pathname, search } = useLocation();
  const { isTopNavContained } = useThemeContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <>
      {!isTopNavContained && <Header />}

      <LeftMenu />
      <Main>
        {isTopNavContained && <Header />}

        <Box className="min-h-[calc(100vh-7rem)]">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Box>
      </Main>
      <MenuBackdrop />
    </>
  );
}
