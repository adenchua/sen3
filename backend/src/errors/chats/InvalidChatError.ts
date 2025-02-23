import { ErrorResponse } from "../ErrorResponse";

export default class InvalidChatError extends ErrorResponse {
  constructor(id: string) {
    super(`Chat with id ${id} does not exist`, "Invalid_Chat_Resource", 404);
  }
}
