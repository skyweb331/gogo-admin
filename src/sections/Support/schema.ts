import { z as zod } from "zod";

export const replySchema = zod.object({
  body: zod.string().trim().min(1, "Write a message").max(5000, "Message must be 1 to 5000 characters"),
});
export type ReplyValues = zod.infer<typeof replySchema>;
