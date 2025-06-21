import Box from "@mui/material/Box";
import { useState } from "react";

import Button from "../../components/Button";
import PageLayout from "../../components/PageLayout";
import AddIcon from "../../icons/AddIcon";
import CreateDeckTemplateDialog from "./CreateDeckTemplateDialog";
import DeckTemplatesContainer from "./DeckTemplatesContainer";

export default function DeckTemplatesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const PAGE_TITLE = "Deck Templates";

  return (
    <PageLayout title={PAGE_TITLE}>
      <Button startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
        Create deck template
      </Button>
      <Box mt={4}>
        <DeckTemplatesContainer />
      </Box>
      <CreateDeckTemplateDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </PageLayout>
  );
}
