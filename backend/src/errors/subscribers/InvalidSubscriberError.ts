import { ErrorResponse } from "../ErrorResponse";

export default class InvalidSubscriberError extends ErrorResponse {
  constructor(id: string) {
    super(`Subscriber with id ${id} does not exist`, "Invalid_Subscriber_Resource", 404);
  }
}
