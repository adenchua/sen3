import { ErrorResponse } from "../middlewares/errorHandlerMiddleware";

export const invalidTelegramChatUsernameError = new ErrorResponse(
  "Telegram chat with provided username does not exist",
  "Invalid_Telegram_Chat_Username",
  400,
);

export const invalidTelegramChatIdError = new ErrorResponse(
  "Telegram chat with provided ID does not exist",
  "Invalid_Telegram_Chat_ID",
  400,
);
