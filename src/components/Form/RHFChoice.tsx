import { FieldErrorTooltip } from "./FieldErrorTooltip";
import { useRegisterLabel } from "./FieldShell";
import { Controller, useFormContext } from "react-hook-form";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
} from "@mui/material";

import { CheckboxSmallChecked, CheckboxSmallEmptyOutlined } from "@/icons/form/mui-checkbox";
import { RadiobuttonSmallChecked, RadiobuttonSmallEmptyOutlined } from "@/icons/form/mui-radiobutton";

type CheckboxProps = {
  name: string;
  label: React.ReactNode;
  /** Plain-text label for FormErrorSummary when `label` is JSX. */
  summaryLabel?: string;
  helperText?: React.ReactNode;
  disabled?: boolean;
};

export function RHFCheckbox({ name, label, summaryLabel, helperText, disabled }: CheckboxProps) {
  const { control } = useFormContext();
  useRegisterLabel(name, summaryLabel ?? label);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} className="mb-2">
          <Box className="flex flex-row items-center gap-1">
            <FormControlLabel
              disabled={disabled}
              label={label}
              control={
                <Checkbox
                  size="small"
                  name={field.name}
                  slotProps={{ input: { ref: field.ref } }}
                  checked={!!field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                  icon={<CheckboxSmallEmptyOutlined />}
                  checkedIcon={<CheckboxSmallChecked />}
                />
              }
            />
            {error?.message && <FieldErrorTooltip title={error.message} inline />}
          </Box>
          {helperText && <FormHelperText className="mt-0">{helperText}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}

type RadioOption = { value: string; label: React.ReactNode; description?: React.ReactNode; disabled?: boolean };
type RadioGroupProps = { name: string; label?: React.ReactNode; options: RadioOption[]; row?: boolean };

export function RHFRadioGroup({ name, label, options, row }: RadioGroupProps) {
  const { control } = useFormContext();
  useRegisterLabel(name, label);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          {label && (
            <FormLabel className="flex flex-row gap-1">
              <Box>{label}</Box>
              {error?.message && <FieldErrorTooltip title={error.message} inline />}
            </FormLabel>
          )}
          <RadioGroup
            row={row}
            name={field.name}
            value={field.value ?? ""}
            onChange={(event) => field.onChange(event.target.value)}
            className="mb-0 flex gap-2"
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                label={
                  option.description ? (
                    <Box className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-text-secondary text-sm">{option.description}</span>
                    </Box>
                  ) : (
                    option.label
                  )
                }
                control={
                  <Radio
                    size="small"
                    icon={<RadiobuttonSmallEmptyOutlined />}
                    checkedIcon={<RadiobuttonSmallChecked />}
                  />
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
}

type SwitchProps = { name: string; label: React.ReactNode; helperText?: React.ReactNode; disabled?: boolean };

export function RHFSwitch({ name, label, helperText, disabled }: SwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl className="mb-2">
          <FormControlLabel
            disabled={disabled}
            label={label}
            control={
              <Switch
                size="small"
                name={field.name}
                slotProps={{ input: { ref: field.ref } }}
                checked={!!field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            }
          />
          {helperText && <FormHelperText className="mt-0">{helperText}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
