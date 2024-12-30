import { ErrorResponse } from "../middlewares/errorHandlerMiddleware";

const invalidTelegramChatError = new ErrorResponse(
  "Telegram chat with provided username does not exist",
  "Invalid_Telegram_Username",
  400,
);

export default invalidTelegramChatError;
