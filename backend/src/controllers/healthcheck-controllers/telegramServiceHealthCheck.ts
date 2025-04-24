import { Request, Response } from "express";

import { telegramInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

export default async function telegramServiceHealthCheck(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await telegramInstance.ping();

  response.send(wrapResponse(result));
}
