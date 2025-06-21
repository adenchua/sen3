import { ErrorResponse } from "../ErrorResponse";

export default class InvalidDeckTemplateError extends ErrorResponse {
  constructor(id: string) {
    super(`Deck template with id ${id} does not exist`, "Invalid_Deck_Template_Resource", 404);
  }
}
