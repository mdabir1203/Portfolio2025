const { createLogger, format, transports } = require('winston');

const environment = process.env.NODE_ENV ?? 'development';

const baseFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] })
);

const developmentFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp, stack, metadata = {} }) => {
    const logMessage = stack ?? message;
    const meta = Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : '';
    return `${timestamp} [${level}] ${logMessage}${meta}`;
  })
);

const productionFormat = format.json();

const logger = createLogger({
  level: environment === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'portfolio-proxy' },
  format: baseFormat,
  transports: [
    new transports.Console({
      format: environment === 'production' ? productionFormat : developmentFormat,
    }),
  ],
});

if (environment !== 'production') {
  logger.debug('Logger initialised in %s mode', environment);
}

module.exports = logger;
