import { PropsWithChildren } from "react";

import { Box } from "@mui/material";

import { cn } from "@/lib/utils";
import { useThemeContext } from "@/theme/theme-provider";
import { ContentType } from "@/types/types";

export default function ContentWrapper({ children, className }: PropsWithChildren<{ className?: string }>) {
  const { content } = useThemeContext();

  return (
    <Box
      className={cn(
        "mx-auto w-full px-4 py-4 md:px-6 lg:px-8 lg:py-8",
        content === ContentType.Boxed && "max-w-340",
        className,
      )}
    >
      {children}
    </Box>
  );
}
