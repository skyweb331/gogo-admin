import Helmet from "@/components/Helmet";
import PageHeader from "@/components/PageHeader";
import View from "@/sections/Support/List/View";

export default function Page() {
  return (
    <>
      <Helmet title="Support" />
      <PageHeader title="Support" crumbs={[{ label: "Support" }]} />
      <View />
    </>
  );
}
