import { FieldShell, type FieldVariant, inputComponentFor } from "./FieldShell";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { IconButton, InputAdornment, type InputProps } from "@mui/material";

import NiEyeClose from "@/icons/nexture/ni-eye-close";
import NiEyeOpen from "@/icons/nexture/ni-eye-open";

export type RHFTextFieldProps = {
  name: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  variant?: FieldVariant;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  className?: string;
  inputProps?: InputProps["inputProps"];
  /** Applied to the stored value, e.g. trimming or upper-casing */
  transform?: (value: string) => unknown;
};

/** limelite's number transforms (replaces `minimal-shared`). */
const toNumber = (value: string) => {
  if (value === "" || value === "-") return value === "" ? null : value;
  const n = Number(value);
  return Number.isNaN(n) ? value : n;
};

export function RHFTextField({
  name,
  label,
  helperText,
  variant = "standard-outlined",
  type = "text",
  disabled,
  readOnly,
  required,
  startAdornment,
  endAdornment,
  className,
  transform,
  inputProps,
  ...other
}: RHFTextFieldProps) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const InputComponent = inputComponentFor(variant);
  const isPassword = type === "password";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FieldShell
          name={name}
          label={label}
          error={error}
          helperText={helperText}
          variant={variant}
          required={required}
          disabled={disabled}
          className={className}
        >
          <InputComponent
            {...other}
            id={name}
            name={field.name}
            inputRef={field.ref}
            value={field.value === null || field.value === undefined ? "" : String(field.value)}
            onBlur={field.onBlur}
            onChange={(event) => {
              const raw = event.target.value;
              field.onChange(transform ? transform(raw) : type === "number" ? toNumber(raw) : raw);
            }}
            type={isPassword ? (showPassword ? "text" : "password") : type === "number" ? "text" : type}
            inputProps={{ ...(type === "number" && { inputMode: "decimal" }), readOnly, ...inputProps }}
            error={!!error}
            startAdornment={startAdornment}
            endAdornment={
              isPassword ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseUp={(event) => event.preventDefault()}
                  >
                    {showPassword ? (
                      <NiEyeClose size="medium" className="text-text-secondary" />
                    ) : (
                      <NiEyeOpen size="medium" className="text-text-secondary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ) : (
                endAdornment
              )
            }
          />
        </FieldShell>
      )}
    />
  );
}
