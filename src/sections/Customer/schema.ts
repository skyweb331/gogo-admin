import { z as zod } from "zod";

export const suspendSchema = zod.object({
  reason: zod
    .string()
    .trim()
    .min(3, "Say why the account is suspended (3 to 500 characters)")
    .max(500, "Reason must be 500 characters or fewer"),
});
export type SuspendValues = zod.infer<typeof suspendSchema>;
