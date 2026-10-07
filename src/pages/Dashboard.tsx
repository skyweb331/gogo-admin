import { Helmet } from "@/components/Helmet";
import PageHeader from "@/components/PageHeader";
import View from "@/sections/Dashboard/View";

export default function Page() {
  return (
    <>
      <Helmet title="Dashboard" />
      <PageHeader title="Dashboard" />
      <View />
    </>
  );
}
