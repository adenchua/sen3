import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import Button from "../../components/Button";
import Chip from "../../components/Chip";
import SettingsIcon from "../../icons/SettingsIcon";
import DeckTemplateInterface from "../../interfaces/deckTemplate";
import ManageDeckTemplateDialog from "./ManageDeckTemplateDialog";

interface IProps {
  deckTemplate: DeckTemplateInterface;
}

export default function DeckTemplateCard(props: IProps) {
  const { deckTemplate } = props;
  const { title, chatIds, isDefault, isDeleted } = deckTemplate;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderColor: "divider",
        minWidth: "240px",
        maxWidth: "600px",
      }}
    >
      <CardContent sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography color="primary">{title}</Typography>
        <Chip label={`${chatIds.length} Chats`} />
        {isDeleted && <Chip label={`Hidden`} color="error" />}
        {isDefault && <Chip label={`Default`} color="primary" />}
      </CardContent>
      <CardActions
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button variant="text" startIcon={<SettingsIcon />} onClick={() => setIsDialogOpen(true)}>
          Manage template
        </Button>
      </CardActions>
      <ManageDeckTemplateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        deckTemplate={deckTemplate}
      />
    </Card>
  );
}
