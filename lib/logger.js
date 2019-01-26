const config = require('./config');

function logInfo (message) {
  if (config.logLevel === 'INFO') {
    console.log(`${new Date().toISOString()} INFO ${message}`);
  }
}

function logError (message) {
  console.error(`${new Date().toISOString()} ERROR ${message}`);
}

module.exports = exports = {
  info: logInfo,
  error: logError
};
