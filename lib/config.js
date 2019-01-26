const log = require('./logger');

let config = {};

function init () {
  let urls = [];
  try {
    urls = process.env.URLS_TO_CHECK.split(',');
  } catch (ignored) {
    log.info('Got not pass URL list. Using emptry list.');
  }
  config = {
    port: process.env.SERVER_PORT || 9000,
    cron: process.env.CRON || '0 0 * * * *',
    logLevel: process.env.LOG_LEVEL || 'ERROR',
    urlsToCheck: urls
  };
  log.info(`Using following config: ${config}`);
}

init();

module.exports = exports = config;
