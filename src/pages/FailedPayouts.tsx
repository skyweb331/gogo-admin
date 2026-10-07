import Helmet from "@/components/Helmet";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import PageHeader from "@/components/PageHeader";
import View from "@/sections/Transaction/List/View";

const SCOPE = { state: "PayoutFailed" };

export default function Page() {
  return (
    <>
      <Helmet title="Failed payouts" />
      <PageHeader title="Failed payouts" crumbs={[{ label: "Failed payouts" }]} />
      <ContentWrapper>
        <View
          scope={SCOPE}
          hidden={["state"]}
          emptyTitle="No failed payouts"
          emptyDescription="Payouts that exhaust their automatic retries land here for a manual retry."
        />
      </ContentWrapper>
    </>
  );
}
