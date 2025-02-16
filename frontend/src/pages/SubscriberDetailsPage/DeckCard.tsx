import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import updateDeck from "../../api/decks/updateDeck";
import IconButton from "../../components/IconButton";
import Switch from "../../components/Switch";
import Tooltip from "../../components/Tooltip";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import DeckIcon from "../../icons/DeckIcon";
import SettingsIcon from "../../icons/SettingsIcon";
import DeckInterface from "../../interfaces/deck";

interface IProps {
  deck: DeckInterface;
  subscriberId: string;
  onUpdateDeck: (updatedDeck: DeckInterface) => void;
  onSelectDeck: (id: string) => void;
  isSelected: boolean;
}

export default function DeckCard(props: IProps) {
  const { deck, subscriberId, onUpdateDeck, onSelectDeck, isSelected } = props;
  const { title, id, isActive } = deck;

  async function handleToggleActive(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const updatedActiveValue = event.target.checked;
    await updateDeck(deck.id, subscriberId, {
      isActive: updatedActiveValue,
    });

    onUpdateDeck({ ...deck, isActive: updatedActiveValue });
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        border: isSelected ? "2px solid" : "",
        borderColor: "primary.main",
        minWidth: "240px",
      }}
    >
      <CardContent
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexGrow: 1,
          width: "240px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onClick={() => onSelectDeck(id)}
      >
        <Avatar variant="rounded">
          <DeckIcon />
        </Avatar>
        <Typography fontWeight="bold" noWrap>
          {title}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          borderTop: "2px solid",
          borderColor: APP_BACKGROUND_COLOR,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          icon={<SettingsIcon />}
          title="Manage deck"
          variant="outlined"
          onClick={() => onSelectDeck(id)}
        />
        <Tooltip title="Toggle deck to receive notifications">
          <Switch checked={isActive} onChange={handleToggleActive} />
        </Tooltip>
      </CardActions>
    </Card>
  );
}
