import { formatMoney, toBigInt } from "./money";

type Tier = { fromInCents: bigint | string; toInCents?: bigint | string | null };

/** Tiers are in USD; "$0 – $5,000", "$10,000+" */
export function tierRangeLabel(tier: Tier) {
  const from = formatMoney(tier.fromInCents, "usd").replace(/\.00$/, "");
  if (tier.toInCents === null || tier.toInCents === undefined) return `${from}+`;
  return `${from} – ${formatMoney(tier.toInCents, "usd").replace(/\.00$/, "")}`;
}

/** Share of the way through the current tier, 0..100 (100 for the open-ended top tier). */
export function tierProgress(volume: bigint | string, tier: Tier) {
  if (tier.toInCents === null || tier.toInCents === undefined) return 100;
  const from = toBigInt(tier.fromInCents);
  const span = toBigInt(tier.toInCents) - from;
  if (span <= 0n) return 100;
  const done = toBigInt(volume) - from;
  return Math.max(0, Math.min(100, Number((done * 10000n) / span) / 100));
}
