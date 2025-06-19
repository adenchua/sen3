import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import DeckTemplateInterface from "../../interfaces/deckTemplate";

const updateDeckTemplate = async (
  deckTemplateId: string,
  updatedFields: Partial<DeckTemplateInterface>,
): Promise<void> => {
  const { title, chatIds, isDefault } = updatedFields;

  await axios.patch(`${BACKEND_SERVICE_API_URL}/api/v1/deck-templates/${deckTemplateId}`, {
    title,
    isDefault,
    chatIds,
  });
};

export default updateDeckTemplate;
