import { z as zod } from "zod";

const role = zod.enum(["Admin", "Support"], { error: "Choose a role" });

export const inviteSchema = zod.object({
  name: zod.string().trim().min(1, "Enter a name").max(120, "Name must be 120 characters or fewer"),
  email: zod.email("Enter a valid email address"),
  role,
});
export type InviteValues = zod.infer<typeof inviteSchema>;

export const editStaffSchema = zod.object({
  name: zod.string().trim().min(1, "Enter a name").max(120, "Name must be 120 characters or fewer"),
  role,
  disabled: zod.boolean(),
});
export type EditStaffValues = zod.infer<typeof editStaffSchema>;
