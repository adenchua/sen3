import { Request, Response, NextFunction } from "express";

import { ErrorResponse } from "../errors/ErrorResponse";

interface ErrorResponseBody {
  errorCode: string;
  message: string;
  details: unknown;
}

const errorHandlerMiddleware = (
  error: Error | ErrorResponse,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // catch all other errors not defined in the code
  if (!("errorCode" in error)) {
    console.error(error);
    response.status(500).send();
    return;
  }

  const { errorCode, errorDetails, message, statusCode } = error;

  const errorResponse: ErrorResponseBody = {
    errorCode,
    message,
    details: errorDetails,
  };

  response.status(statusCode).send({
    status: "error",
    error: errorResponse,
    meta: {
      datetime: new Date().toISOString(),
    },
  });
};

export default errorHandlerMiddleware;
