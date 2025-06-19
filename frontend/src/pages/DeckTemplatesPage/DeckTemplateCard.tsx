import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import updateDeckTemplate from "../../api/deck-templates/updateDeckTemplate";
import Button from "../../components/Button";
import Chip from "../../components/Chip";
import Switch from "../../components/Switch";
import SettingsIcon from "../../icons/SettingsIcon";
import DeckTemplateInterface from "../../interfaces/deckTemplate";
import ManageDeckTemplateDialog from "./ManageDeckTemplateDialog";

interface IProps {
  deckTemplate: DeckTemplateInterface;
}

export default function DeckTemplateCard(props: IProps) {
  const { deckTemplate } = props;
  const { id, title, chatIds, isDefault, isDeleted } = deckTemplate;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  async function handleToggleDeckTemplateDefault(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const updatedActiveValue = event.target.checked;
    await updateDeckTemplate(id, {
      isDefault: updatedActiveValue,
    });

    // invalidate query and refetch deck
    queryClient.invalidateQueries({ queryKey: ["fetchDeckTemplates"] });
  }

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
        <Tooltip title="Set deck to appear for all new subscribers">
          <Switch checked={isDefault} onChange={handleToggleDeckTemplateDefault} />
        </Tooltip>
      </CardActions>
      <ManageDeckTemplateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        deckTemplate={deckTemplate}
      />
    </Card>
  );
}
