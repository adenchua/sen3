import Stack from "@mui/material/Stack";
import { compareDesc } from "date-fns";

import DeckInterface from "../../interfaces/deck";
import DeckCard from "./DeckCard";

interface IProps {
  decks: DeckInterface[];
}

export default function DeckList(props: IProps) {
  const { decks } = props;

  return (
    <Stack spacing={1}>
      {decks
        .sort((a, b) => compareDesc(a.updatedDate, b.updatedDate))
        .map((deck) => {
          return <DeckCard deck={deck} key={deck.id} />;
        })}
    </Stack>
  );
}
