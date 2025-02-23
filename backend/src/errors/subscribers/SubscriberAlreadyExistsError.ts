import { ErrorResponse } from "../ErrorResponse";

export default class SubscriberAlreadyExistsError extends ErrorResponse {
  constructor(id: string) {
    super(`Subscriber with id ${id} already exists`, "Existing_Subscriber_Resource", 409);
  }
}
