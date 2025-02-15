import { ErrorResponse } from "../middlewares/errorHandlerMiddleware";

export const invalidDeckError = new ErrorResponse(
  "Deck with provided ID does not exist",
  "Deck_Does_Not_Exist",
  404,
);
