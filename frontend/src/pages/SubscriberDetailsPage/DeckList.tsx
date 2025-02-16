import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";

import addDeck from "../../api/decks/addDeck";
import fetchDeckById from "../../api/decks/fetchDeckById";
import AddIcon from "../../icons/AddIcon";
import DeckInterface from "../../interfaces/deck";
import DeckCard from "./DeckCard";

interface IProps {
  decks: DeckInterface[];
  subscriberId: string;
  onAddDeck: (newDeck: DeckInterface) => void;
  onUpdateDeck: (updatedDeck: DeckInterface) => void;
  onSelectDeck: (id: string) => void;
  selectedDeckId: string | null;
}

export default function DeckList(props: IProps) {
  const { decks, subscriberId, onAddDeck, onUpdateDeck, onSelectDeck, selectedDeckId } = props;

  async function handleCreateDeck(): Promise<void> {
    const deckTitle = `Untitled Deck ${decks.length + 1}`;
    const newDeckId = await addDeck(subscriberId, deckTitle);
    const newDeck = await fetchDeckById(subscriberId, newDeckId);
    onAddDeck(newDeck);
  }

  return (
    <Stack spacing={2} direction="row" sx={{ overflowX: "auto" }}>
      <div>
        <Card sx={{ height: "100%", width: "240px" }}>
          <CardActionArea
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleCreateDeck}
          >
            <AddIcon fontSize="large" color="primary" />
          </CardActionArea>
        </Card>
      </div>
      {decks.map((deck) => {
        return (
          <DeckCard
            deck={deck}
            key={deck.id}
            onUpdateDeck={onUpdateDeck}
            subscriberId={subscriberId}
            onSelectDeck={onSelectDeck}
            isSelected={selectedDeckId === deck.id}
          />
        );
      })}
    </Stack>
  );
}
