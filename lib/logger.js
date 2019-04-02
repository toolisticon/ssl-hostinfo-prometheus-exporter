const Logger = require('log4bro');

const options = {
  productionMode: process.env.LOG_LEVEL !== 'INFO', // switches loglevel between DEBUG and WARN
  logDir: 'logs', // relative directory to write log file to
  silence: false, // silences logger
  loggerName: 'dev', // ignore
  dockerMode: process.env.CONSOLE_LOG || false, // disables output to logfile
  varKey: 'LOG' // name of global variable
};

const LOG = new Logger(options);

function logInfo (message, additionalFields = {}) {
  LOG.info(message, additionalFields);
}

function logError (message, additionalFields = {}) {
  LOG.error(message, additionalFields);
}

module.exports = exports = {
  info: logInfo,
  error: logError
};
