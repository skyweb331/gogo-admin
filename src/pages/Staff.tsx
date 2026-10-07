import { useState } from "react";

import { Button } from "@mui/material";

import Helmet from "@/components/Helmet";
import PageHeader from "@/components/PageHeader";
import NiPlus from "@/icons/nexture/ni-plus";
import View from "@/sections/Staff/List/View";

export default function Page() {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <Helmet title="Staff" />
      <PageHeader
        title="Staff"
        crumbs={[{ label: "Staff" }]}
        actions={
          <Button variant="contained" startIcon={<NiPlus size="medium" />} onClick={() => setInviteOpen(true)}>
            Invite staff
          </Button>
        }
      />
      <View inviteOpen={inviteOpen} onInviteClose={() => setInviteOpen(false)} />
    </>
  );
}
