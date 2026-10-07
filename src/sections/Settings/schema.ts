import { z as zod } from "zod";

export const feeAccountSchema = zod.object({
  bankName: zod.string().trim().min(1, "Enter the bank name").max(120, "Bank name is too long"),
  accountOwnerName: zod.string().trim().min(1, "Enter the account holder").max(120, "Account holder is too long"),
  routingNumber: zod.string().regex(/^\d{9}$/, "Routing number must be 9 digits"),
  accountNumber: zod.string().regex(/^\d{4,17}$/, "Enter a valid account number"),
  checkingOrSavings: zod.enum(["checking", "savings"], { error: "Choose the account type" }),
  streetLine1: zod.string().trim().min(1, "Enter the street address").max(120, "Street address is too long"),
  streetLine2: zod.string().trim().max(120, "Address line 2 is too long"),
  city: zod.string().trim().min(1, "Enter the city").max(80, "City is too long"),
  state: zod
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, "Use the 2-letter state code"),
  postalCode: zod
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
});
export type FeeAccountValues = zod.infer<typeof feeAccountSchema>;

export const simulateDepositSchema = zod.object({
  customerId: zod.string({ error: "Choose a customer" }).min(1, "Choose a customer"),
  currency: zod.enum(["usd", "eur"]),
  amountInCents: zod
    .bigint()
    .nullable()
    .refine((v) => v !== null && v > 0n, "Enter an amount")
    .refine((v) => v === null || v < 100_000_000_000n, "Use an amount below 1,000,000,000"),
});
export type SimulateDepositValues = zod.infer<typeof simulateDepositSchema>;
