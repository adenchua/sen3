import { ErrorResponse } from "../middlewares/errorHandlerMiddleware";

export const invalidDeckError = new ErrorResponse(
  "Deck with provided ID does not exist",
  "Invalid_Deck_ID",
  400,
);
