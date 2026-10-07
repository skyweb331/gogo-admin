import { Box } from "@mui/material";

import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";

const stringify = (value: unknown) =>
  JSON.stringify(value, (_key, v) => (typeof v === "bigint" ? v.toString() : v), 2) ?? "null";

/** Raw Bridge / audit payloads, read-only. */
export function JsonView({ value, className }: { value: unknown; className?: string }) {
  const text = stringify(value);
  return (
    <Box className={cn("bg-grey-25 relative rounded-lg", className)}>
      <Box className="absolute end-1 top-1">
        <CopyButton value={text} label="Copy JSON" />
      </Box>
      <Box component="pre" className="m-0 max-h-96 overflow-auto p-3 pe-10 font-mono text-xs leading-5">
        {text}
      </Box>
    </Box>
  );
}

export default JsonView;
