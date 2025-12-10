import winston from 'winston';
import chalk from 'chalk';

const { combine, timestamp, printf, errors } = winston.format;

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    success: 'green',
    info: 'blue',
    debug: 'gray'
  }
};

const consoleFormat = printf(({ level, message }) => {
  const icon = {
    error: '❌',
    warn: '⚠️',
    success: '✅',
    info: '📋',
    debug: '🔍'
  }[level] || '';

  const colorize = {
    error: chalk.red,
    warn: chalk.yellow,
    success: chalk.green,
    info: chalk.blue,
    debug: chalk.gray
  }[level] || chalk.white;

  return `${icon} ${colorize(message)}`;
});

const winstonLogger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp()
  ),
  transports: [
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
  exitOnError: false,
  silent: process.env.NODE_ENV === 'test'
});

winston.addColors(customLevels.colors);

export const logger = winstonLogger;

export const setLogLevel = (level: 'error' | 'warn' | 'success' | 'info' | 'debug') => {
  winstonLogger.level = level;
};

export function logInfo(message: string): void {
  winstonLogger.info(message);
}

export function logSuccess(message: string): void {
  winstonLogger.log('success', message);
}

export function logWarning(message: string): void {
  winstonLogger.warn(message);
}

export function logError(message: string): void {
  winstonLogger.error(message);
}

export function logGray(message: string): void {
  winstonLogger.debug(message);
}

export function logDebug(message: string): void {
  winstonLogger.debug(message);
}
