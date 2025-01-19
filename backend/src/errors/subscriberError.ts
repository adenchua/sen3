import { ErrorResponse } from "../middlewares/errorHandlerMiddleware";

export const subscriberAlreadyExistsError = new ErrorResponse(
  "Subscriber with the user ID already exists",
  "Subscriber_Already_Exists",
  409,
);

export const invalidSubscriberError = new ErrorResponse(
  "Subscriber with the user ID does not exist",
  "Subscriber_Does_Not_Exist",
  404,
);
