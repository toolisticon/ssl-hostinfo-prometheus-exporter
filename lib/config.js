let config = {};

function init () {
  config = {
    port: process.env.SERVER_PORT || 9000,
    cron: process.env.CRON || '0 0 * * * *',
    logLevel: process.env.LOG_LEVEL || 'ERROR',
    urlsToCheck: process.env.URLS_TO_CHECK
  };
}

init();

module.exports = exports = config;
