import Helmet from "@/components/Helmet";
import PageHeader from "@/components/PageHeader";
import { useParams } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import View from "@/sections/Support/Detail/View";

export default function Page() {
  const { id = "" } = useParams<"id">();

  return (
    <>
      <Helmet title={`Ticket #${id}`} />
      <PageHeader
        title={`Ticket #${id}`}
        crumbs={[{ label: "Support", href: paths.support.root }, { label: `#${id}` }]}
      />
      <View key={id} id={Number(id)} />
    </>
  );
}
