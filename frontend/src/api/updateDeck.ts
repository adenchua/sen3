import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../constants/api";
import DeckInterface from "../interfaces/deck";

const updateDeck = async (
  deckId: string,
  subscriberId: string,
  updatedFields: Partial<DeckInterface>,
): Promise<void> => {
  const { keywords, title, chatIds, isActive } = updatedFields;

  await axios.patch(
    `${BACKEND_SERVICE_API_URL}/api/v1/subscribers/${subscriberId}/decks/${deckId}`,
    {
      title,
      keywords,
      chatIds,
      isActive,
    },
  );
};

export default updateDeck;
