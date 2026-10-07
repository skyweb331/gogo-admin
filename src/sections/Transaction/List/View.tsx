import { transactionColumns } from "../columns";

import { useMemo } from "react";

import { Alert, Card, CardContent } from "@mui/material";
import type { GridColumnVisibilityModel } from "@mui/x-data-grid";

import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import NiArrowLeftRight from "@/icons/nexture/ni-arrow-left-right";
import { TRANSACTIONS } from "@/libs/Transaction/useApollo";
import { useGridQuery } from "@/routes/hooks";
import { errorMessage } from "@/utils/graphql";
import { andFilter } from "@/utils/parseFilter";
import { useQuery } from "@apollo/client/react";

/**
 * Staff transaction grid. `scope` is ANDed with the grid's own filters, so the
 * failed-payout queue and the customer tab reuse the same list.
 */
export default function TransactionListView({
  scope,
  hidden,
  emptyTitle = "No transactions",
  emptyDescription = "Deposits show up here as soon as Bridge reports them.",
}: {
  scope?: Record<string, unknown>;
  hidden?: string[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const { variables, gridProps } = useGridQuery({ defaultSort: [{ field: "createdAt", sort: "desc" }] });
  const { data, previousData, loading, error } = useQuery(TRANSACTIONS, {
    variables: { ...variables, filter: andFilter(variables.filter, scope) },
    pollInterval: 30_000,
  });
  const result = (data ?? previousData)?.transactions;

  const columnVisibilityModel = useMemo<GridColumnVisibilityModel>(
    () => Object.fromEntries(["currency", ...(hidden ?? [])].map((field) => [field, false])),
    [hidden],
  );

  return (
    <>
      {error && (
        <Alert severity="error" className="mb-4">
          {errorMessage(error)}
        </Alert>
      )}
      <Card>
        <CardContent>
          <DataTable
            {...gridProps}
            rows={result?.transactions ?? []}
            rowCount={result?.total ?? 0}
            columns={transactionColumns}
            loading={loading && !result}
            initialState={{ columns: { columnVisibilityModel } }}
            slots={{
              noRowsOverlay: () => (
                <EmptyState icon={<NiArrowLeftRight size={40} />} title={emptyTitle} description={emptyDescription} />
              ),
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
