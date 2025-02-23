import { ErrorResponse } from "../ErrorResponse";

export default class MaxMessageLimitError extends ErrorResponse {
  constructor() {
    super("Limit exceeded max limit of 1000", "Max_Limit_Telegram_Message", 400);
  }
}
