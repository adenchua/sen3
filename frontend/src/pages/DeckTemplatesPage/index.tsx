import Grid from "@mui/material/Grid";
import { useState } from "react";

import Button from "../../components/Button";
import PageLayout from "../../components/PageLayout";
import AddIcon from "../../icons/AddIcon";
import CreateDeckTemplateDialog from "./CreateDeckTemplateDialog";

export default function DeckTemplatesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

  const PAGE_TITLE = "Deck Templates";

  return (
    <PageLayout title={PAGE_TITLE}>
      <Grid container spacing={1}>
        <Button startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
          Create deck template
        </Button>
      </Grid>
      <CreateDeckTemplateDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </PageLayout>
  );
}
