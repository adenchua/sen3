import { Request, Response } from "express";

import wrapResponse from "../../utils/responseUtils";
import { databaseInstance } from "../../singletons";

export default async function databaseHealthCheck(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await databaseInstance.ping();

  response.send(wrapResponse(result));
}
