import Stack from "@mui/material/Stack";
import { compareAsc } from "date-fns";

import DeckInterface from "../../interfaces/deck";
import DeckCard from "./DeckCard";

interface IProps {
  decks: DeckInterface[];
  subscriberId: string;
}

export default function DeckList(props: IProps) {
  const { decks, subscriberId } = props;

  return (
    <Stack spacing={1}>
      {decks
        .sort((a, b) => compareAsc(a.createdDate, b.createdDate))
        .map((deck) => {
          return <DeckCard deck={deck} key={deck.id} subscriberId={subscriberId} />;
        })}
    </Stack>
  );
}
