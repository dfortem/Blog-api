import { logger } from "./middleware/logger";
import { Response } from "express";

export const APPLICATION_ERROR_NAME = "ApplicationError";

export class ApplicationError extends Error {
  constructor(code: string, message: string, statusCode: number, ...props: any) {
    super(message);

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }

    this.name = APPLICATION_ERROR_NAME;
    this.statusCode = statusCode;
    this.code = code;
  }

  public static fromIError(error: IError, ...props: any) {
    return new ApplicationError(error.code, error.message, error.statusCode);
  }

  public code: string;
  public statusCode: number;
}

export function handleError(error: Error, res: Response) {
  let { message, stack, ...loggedError } = error;
  logger.error(message, {...loggedError, stack: stack});
  let statusCode: number = 500;
  if(error instanceof ApplicationError) {
    statusCode = error.statusCode
  }
  res.status(statusCode).json(error)
}

export type IError = {
  code: string,
  statusCode: number,
  message: string
}

export const MISSING_ID: IError = {
  code: "MISSING_ID",
  statusCode: 400,
  message: "The required id is missing. The action cannot proceed."
}
