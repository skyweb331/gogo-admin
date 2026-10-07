import { ReactNode } from "react";

import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

/** Yes/no dialog for actions that change money, customers or fees. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  color = "primary",
  loading,
  disabled,
  onConfirm,
  onClose,
  children,
}: {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  color?: ButtonProps["color"];
  loading?: boolean;
  disabled?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description && (
          <Typography variant="body2" className="text-text-secondary mb-3">
            {description}
          </Typography>
        )}
        {children}
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="grey" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" color={color} onClick={onConfirm} loading={loading} disabled={disabled}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
