'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),

  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.Console({ format: format.simple(), level: 'error' }),
    new transports.File({ filename: 'combined.log', level: 'info' })
  ]
});

module.exports = logger;
