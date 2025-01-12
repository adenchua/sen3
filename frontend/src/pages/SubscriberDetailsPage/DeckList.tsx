import { StyleOutlined } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Button from "../../components/Button";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import DeckInterface from "../../interfaces/deck";
import DeckCard from "./DeckCard";

interface IProps {
  onSelectDeck: (deck: DeckInterface) => void;
  decks: DeckInterface[];
}

export default function DeckList(props: IProps) {
  const { onSelectDeck, decks } = props;

  return (
    <Stack spacing={2} sx={{ height: "100%", overflowY: "auto" }}>
      <Box
        position="sticky"
        top={0}
        sx={{ background: APP_BACKGROUND_COLOR, zIndex: (theme) => theme.zIndex.fab + 1 }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Manage decks
        </Typography>
        <Button fullWidth startIcon={<StyleOutlined />}>
          Create Deck
        </Button>
      </Box>
      {decks.map((deck) => {
        return <DeckCard deck={deck} onSelectDeck={onSelectDeck} key={deck.id} />;
      })}
    </Stack>
  );
}
