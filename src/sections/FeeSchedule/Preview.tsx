import { calculateTieredFee, effectiveRateBps, type Tier } from "./feeEngine";
import { type FeeTierValue, feeTiersSchema } from "./feeRules";

import { useMemo } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

import { cn } from "@/lib/utils";
import { bpsToPercent, formatMoney } from "@/utils/money";

const withPositions = (tiers: FeeTierValue[]): Tier[] => tiers.map((t, i) => ({ ...t, position: i + 1 }));

const monthlyFee = (volume: bigint, tiers: Tier[]) => calculateTieredFee(0n, volume, tiers).feeInCents;

/** Sample volumes around every tier boundary of both schedules; nothing is hard-coded. */
function sampleVolumes(limits: bigint[]) {
  if (!limits.length) return [100_000n, 1_000_000n, 10_000_000n];
  const top = limits.reduce((a, b) => (a > b ? a : b));
  const set = new Set<bigint>();
  for (const limit of limits) {
    set.add(limit / 2n);
    set.add(limit);
  }
  set.add(top * 2n);
  set.add(top * 5n);
  return [...set].filter((v) => v > 0n).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

const limitsOf = (tiers: Tier[]) => tiers.map((t) => t.toInCents).filter((v): v is bigint => v !== null);

/** Live comparison of the current schedule and the one being edited, using the backend's fee engine. */
export function FeePreview({ current, next }: { current: Tier[] | null; next: FeeTierValue[] }) {
  const valid = feeTiersSchema.safeParse(next).success;
  const proposed = useMemo(() => withPositions(next), [next]);

  const { volumes, chart } = useMemo(() => {
    if (!valid) return { volumes: [], chart: null };
    const limits = [...limitsOf(proposed), ...(current ? limitsOf(current) : [])];
    const volumes = sampleVolumes(limits);
    const max = volumes[volumes.length - 1]!;
    const points = 60;
    const xs = Array.from({ length: points }, (_, i) => (max * BigInt(i + 1)) / BigInt(points));
    const rate = (tiers: Tier[]) => xs.map((v) => effectiveRateBps(monthlyFee(v, tiers), v) / 100);
    return {
      volumes,
      chart: {
        xs: xs.map((v) => Number(v) / 100),
        next: rate(proposed),
        current: current ? rate(current) : null,
      },
    };
  }, [valid, proposed, current]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          Preview
        </Typography>
        <Typography variant="body2" className="text-text-secondary mb-3">
          Total fee for a customer's whole month at each volume (USD equivalent).
        </Typography>
        {!valid || !chart ? (
          <Alert severity="info">Fix the tiers above to see the preview.</Alert>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Monthly volume</TableCell>
                    {current && <TableCell align="right">Current fee</TableCell>}
                    <TableCell align="right">New fee</TableCell>
                    <TableCell align="right">New effective rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {volumes.map((volume) => {
                    const fee = monthlyFee(volume, proposed);
                    const before = current ? monthlyFee(volume, current) : null;
                    return (
                      <TableRow key={volume.toString()}>
                        <TableCell>{formatMoney(volume, "usd")}</TableCell>
                        {current && <TableCell align="right">{formatMoney(before, "usd")}</TableCell>}
                        <TableCell
                          align="right"
                          className={cn(
                            before !== null && fee > before && "text-error",
                            before !== null && fee < before && "text-success",
                          )}
                        >
                          {formatMoney(fee, "usd")}
                        </TableCell>
                        <TableCell align="right">{bpsToPercent(effectiveRateBps(fee, volume))}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box className="mt-4">
              <LineChart
                height={280}
                xAxis={[
                  {
                    data: chart.xs,
                    scaleType: "linear",
                    valueFormatter: (v: number) => formatMoney(Math.round(v * 100), "usd", { compact: true }),
                  },
                ]}
                yAxis={[{ valueFormatter: (v: number) => `${v}%` }]}
                series={[
                  ...(chart.current
                    ? [
                        {
                          data: chart.current,
                          label: "Current",
                          showMark: false,
                          valueFormatter: (v: number | null) => (v === null ? "" : `${v.toFixed(2)}%`),
                        },
                      ]
                    : []),
                  {
                    data: chart.next,
                    label: "New",
                    showMark: false,
                    valueFormatter: (v: number | null) => (v === null ? "" : `${v.toFixed(2)}%`),
                  },
                ]}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
