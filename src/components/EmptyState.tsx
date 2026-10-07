import { ReactNode } from "react";

import { Box, Typography } from "@mui/material";

import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Box className={cn("flex flex-col items-center justify-center gap-2 px-4 py-10 text-center", className)}>
      {icon && <Box className="text-text-disabled mb-1">{icon}</Box>}
      <Typography variant="subtitle1">{title}</Typography>
      {description && (
        <Typography variant="body2" className="text-text-secondary max-w-md">
          {description}
        </Typography>
      )}
      {action && <Box className="mt-2">{action}</Box>}
    </Box>
  );
}

export default EmptyState;
