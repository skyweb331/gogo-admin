import { AuthCard } from "../AuthCard";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../schema";
import { REQUEST_PASSWORD_RESET } from "../useApollo";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { Alert, Box, Button, Typography } from "@mui/material";

import { Form, FormErrorSummary, RHFTextField } from "@/components/Form";
import NiCheckSquare from "@/icons/nexture/ni-check-square";
import { paths } from "@/routes/paths";
import { applyServerErrors, errorMessage } from "@/utils/graphql";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ForgotPasswordView() {
  const { enqueueSnackbar } = useSnackbar();
  const [request] = useMutation(REQUEST_PASSWORD_RESET);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const methods = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await request({ variables: { data: { email: values.email, isAdmin: true } } });
      setSentTo(values.email);
    } catch (error) {
      if (!applyServerErrors(error, setError, ["email"])) enqueueSnackbar(errorMessage(error), { variant: "error" });
    }
  });

  return (
    <AuthCard
      title="Reset password"
      description="Enter your staff email and we'll send you a link to choose a new password. Your authenticator stays the same."
      footer={
        <Typography variant="body1" className="text-text-secondary">
          Remembered it?{" "}
          <Link to={paths.auth.signIn} className="link-primary link-underline-hover">
            Back to sign in
          </Link>
          .
        </Typography>
      }
    >
      {sentTo ? (
        <Alert severity="success" icon={<NiCheckSquare />} className="neutral bg-background-paper/60!">
          If an account exists for <strong>{sentTo}</strong>, a reset link is on its way. The link expires in 1 hour.
        </Alert>
      ) : (
        <Form methods={methods} onSubmit={onSubmit}>
          <RHFTextField name="email" label="Email" type="email" autoComplete="email" autoFocus />
          <FormErrorSummary />
          <Box className="mt-2 flex flex-col">
            <Button type="submit" variant="contained" loading={isSubmitting}>
              Send reset link
            </Button>
          </Box>
        </Form>
      )}
    </AuthCard>
  );
}
