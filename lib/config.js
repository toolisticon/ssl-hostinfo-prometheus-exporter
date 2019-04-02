let config = {};

function init () {
  let urls = [];
  try {
    urls = process.env.URLS_TO_CHECK.split(',');
  } catch (ignored) {
  }
  config = {
    port: process.env.SERVER_PORT || 9000,
    cron: process.env.CRON || '0 0 * * * *',
    urlsToCheck: urls
  };
}

init();

module.exports = exports = config;
