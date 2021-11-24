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

export const COMMENT_NOT_FOUND: IError = {
  code: "COMMENT_NOT_FOUND",
  statusCode: 400,
  message: "The comment id was not found in the database. Please verify the validity of your id."
}

export const COMMENT_ALREADY_DELETED: IError = {
  code: "COMMENT_ALREADY_DELETED",
  statusCode: 403,
  message: "The comment has already been deleted, thus no modification or any other action is allowed."
}

export const MISSING_COMMENT_ID: IError = {
  code: "MISSING_COMMENT_ID",
  statusCode: 400,
  message: "The required comment id is missing. The action cannot proceed."
}

export const MISSING_POST_ID: IError = {
  code: "MISSING_POST_ID",
  statusCode: 400,
  message: "The required post id is missing. The action cannot proceed."
}

export const MISSING_COMMENT_MESSAGE: IError = {
  code: "MISSING_MESSAGE",
  statusCode: 400,
  message: "The comment message is required. The action cannot proceed."
}
