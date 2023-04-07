import winston from "winston";
import path from "path";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json({ space: 2 }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  defaultMeta: { service: "your-service-name" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "logfile.log"),
    }),
  ],
});

logger.info("Hello, world!");
