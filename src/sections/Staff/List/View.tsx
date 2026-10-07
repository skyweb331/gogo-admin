import { type EditStaffValues, editStaffSchema, type InviteValues, inviteSchema } from "../schema";

import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

import type { StaffRowFragment } from "@/__generated__/graphql";
import { useAuthContext } from "@/auth";
import ConfirmDialog from "@/components/ConfirmDialog";
import DataTable from "@/components/DataTable";
import { Form, FormErrorSummary, RHFSelect, RHFSwitch, RHFTextField } from "@/components/Form";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import StatusChip from "@/components/StatusChip";
import { CREATE_STAFF_USER, RESET_STAFF_TOTP, STAFF_USERS, UPDATE_STAFF_USER } from "@/libs/Staff/useApollo";
import { useGridQuery } from "@/routes/hooks";
import { fDate, fRelative } from "@/utils/format-time";
import { applyServerErrors, errorMessage } from "@/utils/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";

const ROLE_OPTIONS = [
  { value: "Support", label: "Support (read-only, plus support tickets)" },
  { value: "Admin", label: "Admin (everything, including fees and payouts)" },
];

export function InviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { enqueueSnackbar } = useSnackbar();
  const [create] = useMutation(CREATE_STAFF_USER, { refetchQueries: [STAFF_USERS] });
  const methods = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", email: "", role: "Support" },
  });

  const close = () => {
    methods.reset();
    onClose();
  };

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await create({ variables: { data: values } });
      enqueueSnackbar(`Invite sent to ${values.email}`, { variant: "success" });
      close();
    } catch (e) {
      if (!applyServerErrors(e, methods.setError, ["name", "email", "role"])) {
        enqueueSnackbar(errorMessage(e), { variant: "error" });
      }
    }
  });

  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Invite staff</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <Typography variant="body2" className="text-text-secondary">
            They get an email to choose a password, then set up an authenticator app on first sign-in.
          </Typography>
          <RHFTextField name="name" label="Name" autoFocus />
          <RHFTextField name="email" label="Email" type="email" />
          <RHFSelect name="role" label="Role" options={ROLE_OPTIONS} />
          <FormErrorSummary />
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="grey" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={methods.formState.isSubmitting}>
            Send invite
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

function EditDialog({ staff, onClose }: { staff: StaffRowFragment; onClose: () => void }) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [update] = useMutation(UPDATE_STAFF_USER);
  const self = user?.id === staff.id;
  const methods = useForm<EditStaffValues>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      name: staff.name,
      role: staff.role === "Admin" ? "Admin" : "Support",
      disabled: !!staff.deletedAt,
    },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await update({ variables: { data: { id: staff.id, ...values } } });
      enqueueSnackbar("Staff user updated", { variant: "success" });
      onClose();
    } catch (e) {
      if (!applyServerErrors(e, methods.setError, ["name", "role", "disabled"])) {
        enqueueSnackbar(errorMessage(e), { variant: "error" });
      }
    }
  });

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Edit {staff.email}</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <RHFTextField name="name" label="Name" />
          <RHFSelect name="role" label="Role" options={ROLE_OPTIONS} disabled={self} />
          <RHFSwitch
            name="disabled"
            label="Disabled"
            helperText={self ? "You can't disable your own account." : "Disabled staff can't sign in."}
            disabled={self}
          />
          <FormErrorSummary />
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="grey" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={methods.formState.isSubmitting}>
            Save
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

export default function StaffListView({
  inviteOpen,
  onInviteClose,
}: {
  inviteOpen: boolean;
  onInviteClose: () => void;
}) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [editing, setEditing] = useState<StaffRowFragment | null>(null);
  const [resetTarget, setResetTarget] = useState<StaffRowFragment | null>(null);
  const { variables, gridProps } = useGridQuery({ defaultSort: [{ field: "name", sort: "asc" }] });
  const { data, previousData, loading, error } = useQuery(STAFF_USERS, { variables });
  const [resetTotp, resetState] = useMutation(RESET_STAFF_TOTP);
  const result = (data ?? previousData)?.staffUsers;

  const onReset = async () => {
    if (!resetTarget) return;
    try {
      await resetTotp({ variables: { id: resetTarget.id } });
      enqueueSnackbar(`${resetTarget.name} sets up a new authenticator on next sign-in`, { variant: "success" });
      setResetTarget(null);
    } catch (e) {
      enqueueSnackbar(errorMessage(e), { variant: "error" });
    }
  };

  const columns = useMemo<GridColDef<StaffRowFragment>[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        minWidth: 220,
        flex: 1,
        renderCell: ({ row }) => (
          <Box className="min-w-0">
            <Typography variant="body2" className="truncate font-semibold">
              {row.name}
              {row.id === user?.id && " (you)"}
            </Typography>
            <Typography variant="caption" className="text-text-secondary block truncate">
              {row.email}
            </Typography>
          </Box>
        ),
      },
      {
        field: "role",
        headerName: "Role",
        type: "singleSelect",
        valueOptions: ["Admin", "Support"],
        width: 120,
        renderCell: ({ row }) => <StatusChip kind="staff" value={row.role} />,
      },
      {
        field: "totpEnabled",
        headerName: "Authenticator",
        type: "boolean",
        width: 140,
        sortable: false,
        renderCell: ({ row }) =>
          row.totpEnabled ? (
            <Chip size="small" color="success" variant="outlined" label="Set up" />
          ) : (
            <Chip size="small" color="warning" variant="outlined" label="Not set up" />
          ),
      },
      {
        field: "deletedAt",
        headerName: "Access",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) =>
          row.deletedAt ? (
            <Chip size="small" color="error" label="Disabled" />
          ) : (
            <Chip size="small" color="success" label="Active" />
          ),
      },
      {
        field: "lastLoginAt",
        headerName: "Last sign-in",
        width: 140,
        filterable: false,
        renderCell: ({ row }) => fRelative(row.lastLoginAt),
      },
      {
        field: "createdAt",
        headerName: "Added",
        width: 130,
        filterable: false,
        renderCell: ({ row }) => fDate(row.createdAt),
      },
      {
        field: "actions",
        headerName: "",
        width: 220,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Box className="flex flex-row gap-1">
            <Button size="small" variant="text" onClick={() => setEditing(row)}>
              Edit
            </Button>
            {row.totpEnabled && row.id !== user?.id && (
              <Button size="small" variant="text" color="error" onClick={() => setResetTarget(row)}>
                Reset authenticator
              </Button>
            )}
          </Box>
        ),
      },
    ],
    [user?.id],
  );

  return (
    <ContentWrapper>
      {error && (
        <Alert severity="error" className="mb-4">
          {errorMessage(error)}
        </Alert>
      )}
      <Card>
        <CardContent>
          <DataTable
            {...gridProps}
            rows={result?.users ?? []}
            rowCount={result?.total ?? 0}
            columns={columns}
            loading={loading && !result}
          />
        </CardContent>
      </Card>

      <InviteDialog open={inviteOpen} onClose={onInviteClose} />
      {editing && <EditDialog key={editing.id} staff={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={!!resetTarget}
        title={`Reset ${resetTarget?.name}'s authenticator?`}
        description="Their current authenticator codes stop working. They scan a new QR code the next time they sign in."
        confirmLabel="Reset"
        color="error"
        loading={resetState.loading}
        onConfirm={onReset}
        onClose={() => setResetTarget(null)}
      />
    </ContentWrapper>
  );
}
