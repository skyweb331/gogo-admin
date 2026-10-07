import "@/instrument";
import "@/i18n/i18n";
import "@/style/global.css";
import "@fontsource/mulish/latin.css";
import "@fontsource/urbanist/latin.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "@/App";
import { ErrorBoundary } from "@/routes/components";
import { routesSection } from "@/routes/sections";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// BigInteger scalars travel as strings
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const router = createBrowserRouter([
  {
    Component: App,
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
