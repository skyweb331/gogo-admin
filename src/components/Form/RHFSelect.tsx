import { FieldShell, type FieldVariant, inputComponentFor } from "./FieldShell";
import { Controller, useFormContext } from "react-hook-form";

import { MenuItem, Select } from "@mui/material";

import NiChevronDownSmall from "@/icons/nexture/ni-chevron-down-small";

export type SelectOption = { value: string | number; label: React.ReactNode; disabled?: boolean };

type Props = {
  name: string;
  label?: React.ReactNode;
  options: SelectOption[];
  helperText?: React.ReactNode;
  variant?: FieldVariant;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function RHFSelect({
  name,
  label,
  options,
  helperText,
  variant = "standard-outlined",
  placeholder,
  ...other
}: Props) {
  const { control } = useFormContext();
  const InputComponent = inputComponentFor(variant);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FieldShell name={name} label={label} error={error} helperText={helperText} variant={variant} {...other}>
          <Select
            id={name}
            name={field.name}
            inputRef={field.ref}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            input={<InputComponent />}
            displayEmpty={!!placeholder}
            IconComponent={NiChevronDownSmall}
            MenuProps={{ className: "outlined" }}
            renderValue={
              placeholder
                ? (value) =>
                    value === "" || value === undefined ? (
                      <span className="text-text-disabled">{placeholder}</span>
                    ) : (
                      options.find((o) => o.value === value)?.label
                    )
                : undefined
            }
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FieldShell>
      )}
    />
  );
}
