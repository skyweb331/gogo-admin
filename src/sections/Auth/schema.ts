import { z as zod } from "zod";

import { emailSchema, newPasswordSchema, otpSchema, requiredString } from "@/schema";

export const signInSchema = zod.object({
  email: emailSchema,
  password: requiredString(),
});
export type SignInValues = zod.infer<typeof signInSchema>;

export const totpSchema = zod.object({ code: otpSchema });
export type TotpValues = zod.infer<typeof totpSchema>;

export const forgotPasswordSchema = zod.object({ email: emailSchema });
export type ForgotPasswordValues = zod.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = zod
  .object({ password: newPasswordSchema, confirm: requiredString() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });
export type ResetPasswordValues = zod.infer<typeof resetPasswordSchema>;
