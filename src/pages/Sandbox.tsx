import Helmet from "@/components/Helmet";
import PageHeader from "@/components/PageHeader";
import View from "@/sections/Settings/Sandbox";

export default function Page() {
  return (
    <>
      <Helmet title="Sandbox tools" />
      <PageHeader title="Sandbox tools" crumbs={[{ label: "Sandbox" }]} />
      <View />
    </>
  );
}
