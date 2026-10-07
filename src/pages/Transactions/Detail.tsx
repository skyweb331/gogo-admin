import Helmet from "@/components/Helmet";
import PageHeader from "@/components/PageHeader";
import { useParams } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import View from "@/sections/Transaction/Detail/View";

export default function Page() {
  const { id = "" } = useParams<"id">();

  return (
    <>
      <Helmet title={`Transaction GOGO-${id}`} />
      <PageHeader
        title={`Transaction GOGO-${id}`}
        crumbs={[{ label: "Transactions", href: paths.transactions.root }, { label: `GOGO-${id}` }]}
      />
      <View key={id} id={Number(id)} />
    </>
  );
}
