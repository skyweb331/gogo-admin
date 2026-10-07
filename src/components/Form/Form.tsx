import { FormLabelsContext } from "./FieldShell";
import { useRef } from "react";
import { type FieldValues, FormProvider, type UseFormReturn } from "react-hook-form";

import { Box } from "@mui/material";

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  className?: string;
  children: React.ReactNode;
};

/** limelite's `Form`: FormProvider + `<form noValidate>`. */
export function Form<T extends FieldValues>({ methods, onSubmit, className, children }: Props<T>) {
  const labels = useRef(new Map<string, string>());
  return (
    <FormProvider {...methods}>
      <FormLabelsContext value={labels.current}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={onSubmit}
          className={className ?? "flex flex-col"}
        >
          {children}
        </Box>
      </FormLabelsContext>
    </FormProvider>
  );
}
