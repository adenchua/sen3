import { Request, Response } from "express";

export default async function healthCheck(request: Request, response: Response): Promise<void> {
  response.sendStatus(200);
}
