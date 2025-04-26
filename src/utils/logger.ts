import pino from "pino";
import { envConfig } from "../config";

// Define log configuration based on environment
const logConfig = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        colorize: true,
      },
    },
    level: "debug",
  },
  production: {
    level: "info",
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
    },
    // In production, we use the default pino logger without pretty formatting
    // for better performance and standard JSON logs for log analyzers
  },
  staging: {
    level: "debug",
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
    },
  },
};

// Select the right config for current environment
const environment = envConfig.NODE_ENV as keyof typeof logConfig;
const config = logConfig[environment] || logConfig.development;

// Create and export the logger
export const logger = pino({
  ...config,
  base: undefined, // Don't add pid and hostname by default
});

// Create a child logger with component context
export const createLogger = (component: string) => {
  return logger.child({ component });
};

export default logger;
