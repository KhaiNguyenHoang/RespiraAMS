import winston from "winston";

const { combine, timestamp, json, colorize, printf } = winston.format;

/*
 * Logger configuration. We'll set the configuration based on the current development environment.
 * Since we deploy application via container and orchestration platform, we'll just log to the console,
 * and let the infrasructure handle file logging.
 * 
 * NOTE: this logger is only used for server (log in terminal). For client component, use console.*
 */

const isProd = process.env.NODE_ENV === "production";

const level = process.env.LOG_LEVEL || (isProd ? "info" : "debug");
const devFormat = printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
});
const format = isProd ? combine(timestamp(), json()) : combine(colorize(), timestamp({ format: "HH:mm:ss" }), devFormat);

// Configure logger
const logger = winston.createLogger({
    level: level,
    format: format,
    transports: [new winston.transports.Console()],
});

export default logger;