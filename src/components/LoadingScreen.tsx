import { Box, CircularProgress } from "@mui/material";

import { cn } from "@/lib/utils";

/** Full-screen spinner for route/guard loading; `inline` for card/section bodies. */
export function LoadingScreen({ inline, className }: { inline?: boolean; className?: string }) {
  return (
    <Box
      className={cn(
        inline
          ? "flex min-h-40 w-full items-center justify-center"
          : "fixed start-0 end-0 top-0 bottom-0 z-[9999] flex flex-col items-center justify-center",
        className,
      )}
    >
      <CircularProgress color="primary" size={32} />
    </Box>
  );
}

export default LoadingScreen;
