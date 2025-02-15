import StyleOutlined from "@mui/icons-material/StyleOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import addDeck from "../../api/decks/addDeck";
import Button from "../../components/Button";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import DeckInterface from "../../interfaces/deck";
import DeckCard from "./DeckCard";
import fetchDeckById from "../../api/decks/fetchDeckById";

interface IProps {
  decks: DeckInterface[];
  subscriberId: string;
  onAddDeck: (newDeck: DeckInterface) => void;
}

export default function DeckList(props: IProps) {
  const { decks, subscriberId, onAddDeck } = props;

  async function handleCreateDeck(): Promise<void> {
    const deckTitle = `Untitled Deck ${decks.length + 1}`;
    const newDeckId = await addDeck(subscriberId, deckTitle);
    const newDeck = await fetchDeckById(subscriberId, newDeckId);
    onAddDeck(newDeck);
  }

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
        <Button fullWidth startIcon={<StyleOutlined />} onClick={handleCreateDeck}>
          Create Deck
        </Button>
      </Box>
      {decks.map((deck) => {
        return <DeckCard deck={deck} key={deck.id} />;
      })}
    </Stack>
  );
}
