import { Request, Response, NextFunction } from "express";

export class ErrorResponse extends Error {
  errorCode: string;
  statusCode: number;

  constructor(message: string, errorCode: string, statusCode: number) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

const errorHandlerMiddleware = (
  error: ErrorResponse,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const errorStatusCode = error.statusCode || 500;
  const errorMessage = errorStatusCode === 500 ? "Internal Server Error" : error.message;
  const errorCode = errorStatusCode === 500 ? "INTERNAL_SERVER_ERROR" : error.errorCode;
  const errorResponse = {
    statusCode: errorStatusCode,
    errorCode,
    message: errorMessage,
  };

  console.error(error);

  response.status(errorStatusCode).send({
    status: "error",
    error: errorResponse,
    timestamp: new Date().toISOString(),
  });
};

export default errorHandlerMiddleware;
