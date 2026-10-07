import { useSnackbar } from "notistack";
import { useState } from "react";

import { Box, Button, Tooltip, Typography } from "@mui/material";

import NiCheckSquare from "@/icons/nexture/ni-check-square";
import NiDuplicate from "@/icons/nexture/ni-duplicate";
import { cn } from "@/lib/utils";

export function useCopy() {
  const { enqueueSnackbar } = useSnackbar();
  const [copied, setCopied] = useState(false);

  const copy = async (value: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      enqueueSnackbar(label, { variant: "success" });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      enqueueSnackbar("Copy failed. Select the text and copy it manually.", { variant: "error" });
    }
  };

  return { copy, copied };
}

export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const { copy, copied } = useCopy();

  return (
    <Tooltip title={copied ? "Copied" : label}>
      <Button
        aria-label={label}
        size="small"
        color="grey"
        variant="text"
        className={cn("icon-only", className)}
        startIcon={copied ? <NiCheckSquare className="text-success" /> : <NiDuplicate />}
        onClick={() => copy(value, `${label === "Copy" ? "Value" : label.replace(/^Copy /, "")} copied`)}
      />
    </Tooltip>
  );
}

/** Label / monospace value / copy button row, used for bank instructions and addresses. */
export function CopyField({
  label,
  value,
  mono = true,
  className,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  className?: string;
}) {
  return (
    <Box className={cn("flex flex-row items-center justify-between gap-2 py-1.5", className)}>
      <Box className="min-w-0">
        <Typography variant="body2" className="text-text-secondary">
          {label}
        </Typography>
        <Typography variant="body1" className={cn("break-all", mono && "font-mono")}>
          {value || "—"}
        </Typography>
      </Box>
      {value && <CopyButton value={value} label={`Copy ${label.toLowerCase()}`} />}
    </Box>
  );
}

export default CopyField;
