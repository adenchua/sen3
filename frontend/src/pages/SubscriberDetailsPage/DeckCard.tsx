import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import updateDeck from "../../api/decks/updateDeck";
import Button from "../../components/Button";
import Switch from "../../components/Switch";
import Tooltip from "../../components/Tooltip";
import DeckIcon from "../../icons/DeckIcon";
import SettingsIcon from "../../icons/SettingsIcon";
import DeckInterface from "../../interfaces/deck";
import ManageDeckDialog from "./ManageDeckDialog";

interface IProps {
  deck: DeckInterface;
}

export default function DeckCard(props: IProps) {
  const { deck } = props;
  const { title, isActive } = deck;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  async function handleToggleActive(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const updatedActiveValue = event.target.checked;
    await updateDeck(deck.id, {
      isActive: updatedActiveValue,
    });

    // invalidate query and refetch deck
    queryClient.invalidateQueries({ queryKey: ["fetchDecksBySubscriber", deck.subscriberId] });
  }

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderColor: "divider",
          minWidth: "240px",
          maxWidth: "600px",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "240px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Avatar variant="rounded" sx={{ bgcolor: "primary.main" }}>
            <DeckIcon />
          </Avatar>
          <Typography noWrap>{title}</Typography>
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
            Manage deck
          </Button>
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="caption" color="primary">
              Receive notifications
            </Typography>
            <Tooltip title="Toggle to receive notifications">
              <Switch checked={isActive} onChange={handleToggleActive} />
            </Tooltip>
          </Box>
        </CardActions>
      </Card>
      <ManageDeckDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} deck={deck} />
    </>
  );
}
