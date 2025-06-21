import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import DeckTemplateInterface from "../../interfaces/deckTemplate";

const updateDeckTemplate = async (
  deckTemplateId: string,
  updatedFields: Partial<DeckTemplateInterface>,
): Promise<void> => {
  await axios.patch(
    `${BACKEND_SERVICE_API_URL}/api/v1/deck-templates/${deckTemplateId}`,
    updatedFields,
  );
};

export default updateDeckTemplate;
