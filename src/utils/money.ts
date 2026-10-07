/** Integer cents everywhere; bigint on the client, BigInteger (string) on the wire. */
export type Cents = bigint;

export type Currency = "usd" | "eur";

export function toBigInt(value: bigint | string | number | null | undefined): bigint {
  if (value === null || value === undefined || value === "") return 0n;
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.trunc(value));
  return BigInt(value.split(".")[0]!);
}

/** 12345n -> "123.45" */
export function centsToDecimal(cents: bigint | string | number): string {
  const value = toBigInt(cents);
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const whole = abs / 100n;
  const fraction = (abs % 100n).toString().padStart(2, "0");
  return `${negative ? "-" : ""}${whole}.${fraction}`;
}

/** "1,234.5" -> 123450n; null when not a valid amount with at most 2 decimals. */
export function decimalToCents(input: string): bigint | null {
  const value = input.replace(/[,\s]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole!) * 100n + BigInt(fraction.padEnd(2, "0") || "0");
}

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(
  cents: bigint | string | number | null | undefined,
  currency: Currency | string = "usd",
  { compact = false }: { compact?: boolean } = {},
): string {
  if (cents === null || cents === undefined) return "—";
  const code = currency.toUpperCase() === "EUR" ? "EUR" : "USD";
  const key = `${code}-${compact}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      ...(compact && { notation: "compact", maximumFractionDigits: 1 }),
    });
    formatters.set(key, formatter);
  }
  // Number is exact for amounts below 2^53 cents (~90 trillion)
  return formatter.format(Number(toBigInt(cents)) / 100);
}

/** Stablecoin amounts: "8,850.00 USDC" */
export function formatToken(cents: bigint | string | number | null | undefined, currency: Currency | string) {
  if (cents === null || cents === undefined) return "—";
  const symbol = currency.toLowerCase() === "eur" ? "EURC" : "USDC";
  const [whole, fraction] = centsToDecimal(cents).split(".");
  return `${Number(whole).toLocaleString("en-US")}.${fraction} ${symbol}`;
}

export const bpsToPercent = (bps: number) => `${(bps / 100).toFixed(bps % 100 === 0 ? 0 : 2)}%`;

export const currencyLabel = (currency: string) => (currency.toLowerCase() === "eur" ? "EUR" : "USD");
