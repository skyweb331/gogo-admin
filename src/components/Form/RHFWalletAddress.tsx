import { RHFTextField } from "./RHFTextField";
import { useFormContext } from "react-hook-form";

import { IconButton, InputAdornment, Tooltip } from "@mui/material";

import NiClipboard from "@/icons/nexture/ni-clipboard";

type Props = { name: string; label?: string; chain: "base" | "solana"; helperText?: React.ReactNode };

/** Address input; validation lives in `walletAddressSchema` (src/schema.ts). */
export function RHFWalletAddress({ name, label = "Wallet address", chain, helperText }: Props) {
  const { setValue } = useFormContext();

  const paste = async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      setValue(name, text, { shouldValidate: true, shouldDirty: true });
    } catch {
      // Clipboard permission denied: the user can still paste manually
    }
  };

  return (
    <RHFTextField
      name={name}
      label={label}
      placeholder={chain === "base" ? "0x…" : "Solana address"}
      autoComplete="off"
      helperText={helperText}
      transform={(value) => value.trim()}
      inputProps={{ spellCheck: false, className: "font-mono" }}
      endAdornment={
        <InputAdornment position="end">
          <Tooltip title="Paste">
            <IconButton aria-label="Paste address" onClick={paste} size="small">
              <NiClipboard size="small" className="text-text-secondary" />
            </IconButton>
          </Tooltip>
        </InputAdornment>
      }
    />
  );
}
