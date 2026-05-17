import pino from 'pino';

// Singleton logger to ensure consistent structured JSON logging across the layer
const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label: string) => {
      return { level: label };
    },
  },
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
    service: 'ecovolt-mcp-layer',
  },
});

export const logInfo = (msg: string, context?: Record<string, any>) => logger.info(context || {}, msg);
export const logWarn = (msg: string, context?: Record<string, any>) => logger.warn(context || {}, msg);
export const logError = (msg: string, error?: Error | unknown, context?: Record<string, any>) => {
  logger.error(
    {
      err: error,
      ...context,
    },
    msg
  );
};
