import { AuthCard } from "../AuthCard";
import { resetPasswordSchema, type ResetPasswordValues } from "../schema";
import { RESET_PASSWORD } from "../useApollo";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { Alert, Box, Button, Typography } from "@mui/material";

import { useAuthContext } from "@/auth";
import { Form, FormErrorSummary, RHFTextField } from "@/components/Form";
import NiCrossSquare from "@/icons/nexture/ni-cross-square";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { applyServerErrors, errorMessage } from "@/utils/graphql";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ResetPasswordView() {
  const token = useSearchParams().get("token") ?? "";
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [resetPassword] = useMutation(RESET_PASSWORD);

  const methods = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await resetPassword({ variables: { data: { token, password: values.password } } });
      // Resetting revokes existing sessions
      if (isAuthenticated) await signOut();
      enqueueSnackbar("Password saved. Sign in with your new password.", { variant: "success" });
      router.replace(paths.auth.signIn);
    } catch (error) {
      if (!applyServerErrors(error, setError, ["password"])) enqueueSnackbar(errorMessage(error), { variant: "error" });
    }
  });

  return (
    <AuthCard
      title="Choose a password"
      description="Use at least 10 characters with a letter and a number. This link also completes a staff invite."
      footer={
        <Typography variant="body1" className="text-text-secondary">
          Link expired?{" "}
          <Link to={paths.auth.forgotPassword} className="link-primary link-underline-hover">
            Request a new one
          </Link>
          .
        </Typography>
      }
    >
      {!token ? (
        <Alert severity="error" icon={<NiCrossSquare />} className="neutral bg-background-paper/60!">
          This reset link is incomplete. Open the link from your email again, or request a new one.
        </Alert>
      ) : (
        <Form methods={methods} onSubmit={onSubmit}>
          <RHFTextField name="password" label="New password" type="password" autoComplete="new-password" autoFocus />
          <RHFTextField name="confirm" label="Confirm password" type="password" autoComplete="new-password" />
          <FormErrorSummary />
          <Box className="mt-2 flex flex-col">
            <Button type="submit" variant="contained" loading={isSubmitting}>
              Save password
            </Button>
          </Box>
        </Form>
      )}
    </AuthCard>
  );
}
