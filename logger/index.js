import morgan from "morgan";
import { createLogger, format , transports} from "winston";
const { timestamp, combine, errors, json } = format;

const logger = createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({
        filename: "./logs/all-logs.log",
        handleExceptions: true,
        json: false,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false,
    }),
    new transports.Console()
],
    exitOnError: false,
});

export default logger;