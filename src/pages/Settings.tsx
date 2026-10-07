import Helmet from "@/components/Helmet";
import PageHeader from "@/components/PageHeader";
import View from "@/sections/Settings/View";

export default function Page() {
  return (
    <>
      <Helmet title="Settings" />
      <PageHeader title="Settings" crumbs={[{ label: "Settings" }]} />
      <View />
    </>
  );
}
