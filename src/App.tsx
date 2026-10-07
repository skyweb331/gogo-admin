import { Suspense } from "react";
import { Outlet } from "react-router";

import { Box, StyledEngineProvider } from "@mui/material";

import ApolloAppProvider from "@/ApolloProvider";
import { AuthProvider } from "@/auth";
import BackgroundWrapper from "@/components/layout/containers/background-wrapper";
import SnackbarWrapper from "@/components/layout/containers/snackbar-wrapper";
import LayoutContextProvider from "@/components/layout/layout-context";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DayjsProvider } from "@/DayjsProvider";
import ThemeProvider from "@/theme/theme-provider";

const App = () => (
  <StyledEngineProvider enableCssLayer>
    <Box lang="en" dir="ltr" className="font-mulish font-urbanist relative antialiased">
      {/* Initial loader */}
      <div id="initial-loader">
        <div className="spinner"></div>
      </div>
      {/* Initial loader end */}

      <ThemeProvider>
        <LayoutContextProvider>
          <BackgroundWrapper />
          <SnackbarWrapper>
            <ApolloAppProvider>
              <DayjsProvider>
                <AuthProvider>
                  <Suspense fallback={<LoadingScreen />}>
                    <Outlet />
                  </Suspense>
                </AuthProvider>
              </DayjsProvider>
            </ApolloAppProvider>
          </SnackbarWrapper>
        </LayoutContextProvider>
      </ThemeProvider>
    </Box>
  </StyledEngineProvider>
);

export default App;
