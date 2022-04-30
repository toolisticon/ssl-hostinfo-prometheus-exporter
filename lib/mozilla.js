
const fetch = require('node-fetch');
const log = require('./logger');
const sslChecker = require('ssl-checker');
const prometheus = require('./prometheus');

const baseUrl = 'https://http-observatory.security.mozilla.org/api/v1/analyze';

async function triggerScan (hostname, port) {
  log.info(`Triggering scan for ${hostname}`);
  return fetch(`${baseUrl}?host=${hostname}&rescan=true&hidden=true`, {
    method: 'POST',
    port
  });
}

async function receiveScanResult (hostname, additionalMetadata = {}) {
  log.info(`Reading scan results for ${hostname}`);
  const response = await fetch(`${baseUrl}?host=${hostname}`, {
    method: 'GET',
    json: true
  });
  const json = await response.json();
  if (response && response.ok && json && json.score) {
    response.url = hostname;
    response.quantile = json.score;
    prometheus.addMozillaMetric(response, additionalMetadata);
  } else {
    log.info('Skipping invalid response for mozilla scoring');
  }
  // add cert metric
  sslChecker(hostname).then((result) => {
    result.url = hostname;
    result.status = 200;
    result.quantile = result.status;
    prometheus.addDetailsMetric(result, additionalMetadata);
    prometheus.addExpireMetric({ url: result.url, quantile: result.daysRemaining }, additionalMetadata);
  }).catch((err) => {
    const result = {
      url: hostname,
      valid: false
    };
    if (err.code === 'ENOTFOUND') {
      result.status = 404;
      result.quantile = result.status;
      prometheus.addExpireMetric(result, additionalMetadata);
    } else {
      result.status = 400;
      result.quantile = result.status;
      prometheus.addExpireMetric(result, additionalMetadata);
    }
  });
}

module.exports = exports = {
  triggerScan,
  receiveScanResult
};
