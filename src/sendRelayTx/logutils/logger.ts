import path from "path";
import winston from "winston";

const { combine, timestamp, label, prettyPrint } = winston.format;

export const createItxLogger = ({ folderPath }: { folderPath: string }) =>
  winston.createLogger({
    level: "info",
    format: combine(timestamp(), prettyPrint()),
    defaultMeta: { service: "itx-hash-service" },
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.resolve(folderPath, "itxHash.log"),
      }),
    ],
  });

export const createReceiptLogger = ({ folderPath }: { folderPath: string }) =>
  winston.createLogger({
    level: "info",
    format: combine(timestamp(), prettyPrint()),
    defaultMeta: { service: "itx-receipt-service" },
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.resolve(folderPath, "itxReceipt.log"),
      }),
    ],
  });
