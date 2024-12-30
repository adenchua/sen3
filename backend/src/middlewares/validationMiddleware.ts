import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

/** Common validation middleware that runs validation chains and output an error */
const validationMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const result = validationResult(request);

  // no errors, go ahead to the next middleware
  if (result.isEmpty()) {
    next();
    return;
  }

  response.status(400).send({ errors: result.array() });
};

export default validationMiddleware;
