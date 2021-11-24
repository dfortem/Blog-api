import * as winston from "winston";
import { format } from "winston";
import expressWinston from "express-winston";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level:            "info",
      format:           format.combine(
        format.timestamp(),
        format.metadata(),
        format.json(),
      ),
      filename:         "logs/all-logs.log",
      handleExceptions: true
    }),
    new winston.transports.File({
      filename:         "logs/error.log",
      level:            "error",
      format:           format.combine(
        format.timestamp(),
        format.metadata(),
        format.json(),
      ),
      handleExceptions: true
    })
  ],
  exitOnError: false
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    level: "info",
    format: winston.format.combine(
      format.colorize(),
      format.simple()
    ),
    handleExceptions: true
  }));
}

export const middlewareLogger = expressWinston.logger({
  transports: [
    ...logger.transports
  ]
});