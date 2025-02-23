import { ErrorResponse } from "../ErrorResponse";

export default class InvalidDeckError extends ErrorResponse {
  constructor(id: string) {
    super(`Deck with id ${id} does not exist`, "Invalid_Deck_Resource", 404);
  }
}
