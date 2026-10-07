import Helmet from "@/components/Helmet";
import PageHeader from "@/components/PageHeader";
import View from "@/sections/Customer/List/View";

export default function Page() {
  return (
    <>
      <Helmet title="Customers" />
      <PageHeader title="Customers" crumbs={[{ label: "Customers" }]} />
      <View />
    </>
  );
}
