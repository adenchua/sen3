export class ErrorResponse extends Error {
  errorCode: string;
  statusCode: number;
  errorDetails: unknown;

  constructor(
    message = "Internal Server Error",
    errorCode = "INTERNAL_SERVER_ERROR",
    statusCode = 500,
    errorDetails = {},
  ) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
  }
}
