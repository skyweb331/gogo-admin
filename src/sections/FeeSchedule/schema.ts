import { effectivePeriodSchema, type FeeTierValue, feeTiersSchema } from "./feeRules";

import { z as zod } from "zod";

import { fPeriod } from "@/utils/format-time";

/** One editor row: "From" is derived, the last row's "Up to" is ignored (no limit), rate is a percent. */
export const tierRowSchema = zod.object({
  toInCents: zod.bigint().nullable(),
  rate: zod.number().nullable(),
});
export type TierRowValues = zod.infer<typeof tierRowSchema>;

export function toTiers(rows: TierRowValues[]): FeeTierValue[] {
  let from = 0n;
  return rows.map((row, index) => {
    const to = index === rows.length - 1 ? null : row.toInCents;
    const tier = { fromInCents: from, toInCents: to, rateBps: Math.round((row.rate ?? 0) * 100) };
    from = to ?? from;
    return tier;
  });
}

export function toRows(tiers: { position: number; toInCents?: bigint | null; rateBps: number }[]): TierRowValues[] {
  return [...tiers]
    .sort((a, b) => a.position - b.position)
    .map((t) => ({ toInCents: t.toInCents ?? null, rate: t.rateBps / 100 }));
}

export const feeScheduleSchema = zod
  .object({
    effectivePeriod: effectivePeriodSchema(),
    notes: zod.string().trim().max(500, "Notes must be 500 characters or fewer"),
    notifyCustomers: zod.boolean(),
    tiers: zod.array(tierRowSchema),
  })
  .superRefine((values, ctx) => {
    let incomplete = false;
    values.tiers.forEach((row, index) => {
      if (row.rate === null) {
        incomplete = true;
        ctx.addIssue({ code: "custom", path: ["tiers", index, "rate"], message: "Enter a rate" });
      }
      if (index < values.tiers.length - 1 && row.toInCents === null) {
        incomplete = true;
        ctx.addIssue({ code: "custom", path: ["tiers", index, "toInCents"], message: "Enter where this tier ends" });
      }
    });
    if (incomplete) return;

    const parsed = feeTiersSchema.safeParse(toTiers(values.tiers));
    if (parsed.success) return;
    for (const issue of parsed.error.issues) {
      const [index, field] = issue.path;
      if (typeof index !== "number") {
        ctx.addIssue({ code: "custom", path: ["tiers"], message: issue.message });
        continue;
      }
      // "From" is derived from the previous row, so its errors belong to that row's "Up to"
      const target =
        field === "rateBps"
          ? ["tiers", index, "rate"]
          : field === "fromInCents"
            ? ["tiers", Math.max(0, index - 1), "toInCents"]
            : ["tiers", index, "toInCents"];
      ctx.addIssue({ code: "custom", path: target, message: issue.message });
    }
  });
export type FeeScheduleValues = zod.infer<typeof feeScheduleSchema>;

/** `count` months starting at `earliest` ("YYYY-MM"), for the effective-month picker. */
export function futureMonths(earliest: string, count = 12) {
  const [year, month] = earliest.split("-").map(Number) as [number, number];
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.UTC(year, month - 1 + i, 1));
    const value = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    return { value, label: `${fPeriod(value)} (from the 1st)` };
  });
}

export const softCapSchema = zod.object({
  softCap: zod.number({ error: "Enter a percentage" }).min(0, "Use 0% to 100%").max(100, "Use 0% to 100%"),
});
export type SoftCapValues = zod.infer<typeof softCapSchema>;
