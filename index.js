const http = require('http');
const request = require('request-promise-native');
const sslChecker = require('ssl-checker');

const config = require('./lib/config');
const log = require('./lib/logger');
const prometheus = require('./lib/prometheus');

const baseUrl = 'https://http-observatory.security.mozilla.org/api/v1/analyze';

async function triggerScan (hostname) {
  const options = {
    method: 'POST',
    uri: `${baseUrl}?host=${hostname}&rescan=true&hidden=true`
  };

  log.info(`Triggering scan for ${hostname}`);
  request(options);
}

async function receiveScanResult (hostname, additionalMetadata = {}) {
  log.info(`Reading scan results for ${hostname}`);
  const options = {
    method: 'GET',
    uri: `${baseUrl}?host=${hostname}`,
    json: true
  };
  const response = await request(options);
  if (response && response.score) {
    response.url = hostname;
    response.quantile = response.score;
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
    prometheus.addExpireMetric({ url: result.url, quantile: result.days_remaining }, additionalMetadata);
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

/**
 * Checks a single url
 *
 * @param {String} hostname - hostname to check
 * @param {Object} additionalMetadata - additional key-value based metadata
 */
async function updateRouteInfo (hostname, additionalMetadata) {
  triggerScan(hostname);
  // defer read results
  setTimeout(() => receiveScanResult(hostname, additionalMetadata), 200);
}
/**
 * Checks a list of urls
 *
 * @param {Array} hostnames - hostnames to check
 * @param {Object} additionalMetadata - additional key-value based metadata
 */
async function updateRoutesInfo (hostnames, additionalMetadata) {
  log.info(`Triggering scan for ${hostnames}`);
  // reset data on route update
  prometheus.updateHosts(hostnames);
  hostnames.forEach((hostname) => {
    triggerScan(hostname);
    // defer read results
    setTimeout(() => receiveScanResult(hostname, additionalMetadata), 200);
  });
}

// start http server
function startPrometheusListener () {
  const server = http.createServer((req, res) => {
    switch (req.url) {
      case '/':
        return res.end(prometheus.renderMetrics());
      default:
        return res.end('404');
    }
  });

  server.listen(config.port);
  log.info(`prometheus-exporter listening at ${config.port}`);
}

module.exports = exports = {
  config: config,
  updateRouteInfo: updateRouteInfo,
  updateRoutesInfo: updateRoutesInfo,
  updateHosts: prometheus.updateHosts,
  resetRouteInfo: prometheus.reset,
  startPrometheusListener: startPrometheusListener,
  logger: log
};
