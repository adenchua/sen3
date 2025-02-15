import { ErrorResponse } from "../middlewares/errorHandlerMiddleware";

export const invalidTelegramChatUsernameError = new ErrorResponse(
  "Telegram chat with provided username does not exist",
  "Invalid_Telegram_Chat_Username",
  404,
);

export const invalidTelegramChatIdError = new ErrorResponse(
  "Telegram chat with provided ID does not exist",
  "Telegram_Chat_Does_Not_Exist",
  404,
);
