import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { ErrorResponse } from "../errors/ErrorResponse";

class CustomValidationError extends ErrorResponse {
  constructor(errors: ValidationError[]) {
    super("Validation for some fields failed", "Validation_Error", 400, errors);
  }
}

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

  throw new CustomValidationError(result.array());
};

export default validationMiddleware;
