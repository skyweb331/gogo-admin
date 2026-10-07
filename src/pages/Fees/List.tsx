import { Link } from "react-router";

import { Button } from "@mui/material";

import { useAuthContext } from "@/auth";
import Helmet from "@/components/Helmet";
import PageHeader from "@/components/PageHeader";
import NiPlus from "@/icons/nexture/ni-plus";
import { paths } from "@/routes/paths";
import View from "@/sections/FeeSchedule/List/View";

export default function Page() {
  const { isAdmin } = useAuthContext();

  return (
    <>
      <Helmet title="Fees" />
      <PageHeader
        title="Fees"
        crumbs={[{ label: "Fees" }]}
        actions={
          isAdmin && (
            <Button component={Link} to={paths.fees.new} variant="contained" startIcon={<NiPlus size="medium" />}>
              New schedule
            </Button>
          )
        }
      />
      <View />
    </>
  );
}
