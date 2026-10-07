import { forwardRef, useEffect } from "react";
import { isRouteErrorResponse, Link, type LinkProps, useRouteError } from "react-router";

import { Box, Button, Typography } from "@mui/material";

import * as Sentry from "@sentry/react";

export const RouterLink = forwardRef<HTMLAnchorElement, Omit<LinkProps, "to"> & { href: string }>(function RouterLink(
  { href, ...other },
  ref,
) {
  return <Link ref={ref} to={href} {...other} />;
});

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  if (import.meta.env.DEV) console.error(error);

  useEffect(() => {
    if (!notFound) Sentry.captureException(error);
  }, [error, notFound]);

  return (
    <Box className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <Typography variant="h3">{notFound ? "Page not found" : "Something went wrong"}</Typography>
      <Typography className="text-text-secondary max-w-md">
        {notFound
          ? "The page you are looking for doesn't exist or has been moved."
          : "An unexpected error occurred. Reload the page, and contact support if it keeps happening."}
      </Typography>
      <Button variant="contained" onClick={() => (window.location.href = "/")}>
        Go home
      </Button>
    </Box>
  );
}
