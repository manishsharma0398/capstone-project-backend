import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { ENV } from "./env";

const level = ENV.NODE_ENV === "production" ? "info" : "debug";

const transports: winston.transport[] = [
  new winston.transports.Console({
    level,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxSize: "20m",
    maxFiles: "14d",
  }),
  new DailyRotateFile({
    filename: "logs/combined-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
  }),
];

const format: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.errors({ stack: true }),
  winston.format.metadata()
);

export const logger = winston.createLogger({
  level,
  format,
  transports,
});
