import { ErrorResponse } from "../middlewares/errorHandlerMiddleware";

export const subscriberAlreadyExistsError = new ErrorResponse(
  "Subscriber with the user ID already exists",
  "Subscriber_Already_Exists",
  409,
);
