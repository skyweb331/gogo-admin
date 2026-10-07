import { Typography, TypographyProps } from "@mui/material";

import { formatMoney, formatToken } from "@/utils/money";

type Props = Omit<TypographyProps, "children"> & {
  cents?: bigint | number | string | null;
  currency?: string | null;
  /** Render as USDC/EURC instead of $/€ */
  token?: boolean;
  compact?: boolean;
};

export function MoneyText({ cents, currency, token, compact, ...props }: Props) {
  const text =
    cents === null || cents === undefined
      ? "—"
      : token
        ? formatToken(cents, currency ?? "usd")
        : formatMoney(cents, currency ?? "usd", { compact });

  return (
    <Typography component="span" variant="inherit" className="tabular-nums" {...props}>
      {text}
    </Typography>
  );
}

export default MoneyText;
