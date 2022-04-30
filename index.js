const http = require('http');

const config = require('./lib/config');
const log = require('./lib/logger');
const mozilla = require('./lib/mozilla');
const prometheus = require('./lib/prometheus');
const url = require('./lib/url');

/**
 * Checks a single url
 *
 * @param {String} hostname - hostname to check
 * @param {Number} port - port to use
 * @param {Object} additionalMetadata - additional key-value based metadata
 */
async function updateRouteInfo (hostname, port, additionalMetadata) {
  mozilla.triggerScan(hostname, port);
  // defer read results
  setTimeout(() => mozilla.receiveScanResult(hostname, additionalMetadata), 200);
}
/**
 * Checks a list of urls
 *
 * @param {Array} hostEntries - hostnames to check (may include ports ... e.g. example.com:8443)
 * @param {Object} additionalMetadata - additional key-value based metadata
 */
async function updateRoutesInfo (hostEntries, additionalMetadata) {
  log.info(`Triggering scan for ${hostEntries}`);
  // reset data on route update
  const domainList = [];
  url.extractHostnamesAndPort(hostEntries).forEach((hostEntry) => {
    domainList.push(hostEntry.domain);
  });
  prometheus.updateHosts(domainList);
  url.extractHostnamesAndPort(hostEntries).forEach((hostEntry) => {
    mozilla.triggerScan(hostEntry.domain, hostEntry.port);
    // defer read results
    setTimeout(() => mozilla.receiveScanResult(hostEntry.domain, additionalMetadata), 200);
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
  config,
  updateRouteInfo,
  updateRoutesInfo,
  updateHosts: prometheus.updateHosts,
  resetRouteInfo: prometheus.reset,
  triggerScan: mozilla.triggerScan,
  startPrometheusListener,
  logger: log
};
