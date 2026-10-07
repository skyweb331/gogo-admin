import Helmet from "@/components/Helmet";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import PageHeader from "@/components/PageHeader";
import View from "@/sections/Transaction/List/View";

export default function Page() {
  return (
    <>
      <Helmet title="Transactions" />
      <PageHeader title="Transactions" crumbs={[{ label: "Transactions" }]} />
      <ContentWrapper>
        <View />
      </ContentWrapper>
    </>
  );
}
