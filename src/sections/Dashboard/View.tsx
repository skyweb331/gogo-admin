import { ReactNode } from "react";
import { Link } from "react-router";

import { Alert, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import LoadingScreen from "@/components/LoadingScreen";
import { cn } from "@/lib/utils";
import { DASHBOARD_STATS } from "@/libs/Admin/useApollo";
import { paths } from "@/routes/paths";
import { fPeriod } from "@/utils/format-time";
import { errorMessage } from "@/utils/graphql";
import { formatMoney, toBigInt } from "@/utils/money";
import { useQuery } from "@apollo/client/react";

function Stat({
  label,
  value,
  hint,
  href,
  alert,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  href?: string;
  alert?: boolean;
}) {
  const body = (
    <CardContent>
      <Typography variant="body2" className="text-text-secondary">
        {label}
      </Typography>
      <Typography variant="h4" component="p" className={cn("mt-1 mb-0", alert && "text-error")}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" className="text-text-secondary">
          {hint}
        </Typography>
      )}
    </CardContent>
  );
  return (
    <Card className="h-full">
      {href ? (
        <Link to={href} className="block h-full">
          {body}
        </Link>
      ) : (
        body
      )}
    </Card>
  );
}

const shortDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export default function DashboardView() {
  const { data, loading, error } = useQuery(DASHBOARD_STATS, { pollInterval: 60_000 });
  const stats = data?.dashboardStats;

  if (loading && !stats) return <LoadingScreen inline />;
  if (!stats) {
    return (
      <ContentWrapper>
        <Alert severity="error">{error ? errorMessage(error) : "Stats are unavailable."}</Alert>
      </ContentWrapper>
    );
  }

  const month = fPeriod(stats.periodKey);
  const volumes = stats.daily.map((d) => Number(toBigInt(d.volumeInCents)) / 100);

  return (
    <ContentWrapper>
      {error && (
        <Alert severity="warning" className="mb-4">
          Showing the last loaded numbers. {errorMessage(error)}
        </Alert>
      )}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Stat label="Volume" value={formatMoney(stats.volumeInCents, "usd")} hint={`${month}, USD equivalent`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Stat label="Fees earned" value={formatMoney(stats.feesInCents, "usd")} hint={month} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Stat
            label="Deposits"
            value={stats.depositCount.toLocaleString("en-US")}
            hint={month}
            href={paths.transactions.root}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Stat
            label="Active customers"
            value={stats.activeCustomers.toLocaleString("en-US")}
            hint={`${stats.onboardingCustomers} onboarding`}
            href={paths.customers.root}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Stat
            label="Failed payouts"
            value={stats.failedPayouts}
            hint={`${stats.inFlightPayouts} in flight`}
            href={paths.failedPayouts}
            alert={stats.failedPayouts > 0}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Stat label="Pending KYC" value={stats.pendingKyc} hint="Waiting on Bridge review" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Stat label="Open tickets" value={stats.openTickets} href={paths.support.root} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Stat
            label="Failed webhooks"
            value={stats.failedWebhooks}
            href={paths.webhooks}
            alert={stats.failedWebhooks > 0}
          />
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                Daily volume
              </Typography>
              <Typography variant="body2" className="text-text-secondary">
                Deposits received per day, USD equivalent
              </Typography>
              {stats.daily.length === 0 ? (
                <Box className="text-text-secondary py-16 text-center">No deposits in this period yet.</Box>
              ) : (
                <BarChart
                  height={300}
                  xAxis={[{ scaleType: "band", data: stats.daily.map((d) => shortDate(d.date)) }]}
                  yAxis={[
                    { valueFormatter: (v: number) => formatMoney(Math.round(v * 100), "usd", { compact: true }) },
                  ]}
                  series={[
                    {
                      data: volumes,
                      label: "Volume",
                      valueFormatter: (v) => (v === null ? "" : formatMoney(Math.round(v * 100), "usd")),
                    },
                  ]}
                  hideLegend
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
}
