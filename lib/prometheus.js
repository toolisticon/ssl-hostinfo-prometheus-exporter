const isValid = require('date-fns/isValid');
const format = require('date-fns/format');
const parse = require('date-fns/parse');

// CONFIG
const mozillaMetricName = 'security_ssl_mozilla_observatory';
const sslDetailsMetricName = 'security_ssl_details';
const sslExpireMetricName = 'security_ssl_expire_days_remaining';

let resultStore = {};

function init () {
  resultStore = {};
}

function convertKeyValuePair (key, value) {
  if (value instanceof Object) {
    let result = '';
    Object.keys(value).map((subKey) => {
      const subValue = value[subKey];
      try {
        result += `${key.toLowerCase()}_${convertKeyValuePair(subKey, JSON.parse(subValue))}`;
      } catch (ignored) {
        result += `${key.toLowerCase()}_${convertKeyValuePair(subKey, subValue)}`;
      }
    });
    return result;
  } else {
    let validDate = false;
    let date = parse(value, 'EEE, dd MMM yyyy HH:mm:ss \'GMT\'', new Date());
    if (isValid(date)) {
      validDate = true;
    } else {
      date = parse(value, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", new Date());
      if (isValid(date)) {
        validDate = true;
      }
    }
    const labelKey = key.toLowerCase().split('-').join('_').split('.').join('_');
    if (validDate) {
      return `${labelKey}="${format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}",`;
    } else {
      return `${labelKey}="${value}",`;
    }
  }
}

function json2prom (metricName, jsonObject) {
  if (jsonObject) {
    // TODO parse response headers
    delete jsonObject.response_headers;
    // TODO parse annotations
    delete jsonObject.annotations;
    // Drop private data
    delete jsonObject.resourceVersion;
    delete jsonObject.creationTimestamp;
    delete jsonObject.selflink;
    // build metris object entry
    let promObject = `${metricName}{`;
    Object.keys(jsonObject).map((key) => {
      const value = jsonObject[key];
      promObject += convertKeyValuePair(key, value);
    });
    promObject += '}';
    if (jsonObject.quantile || jsonObject.quantile === 0) {
      promObject += ` ${jsonObject.quantile}.0`;
    } else {
      promObject += ' NaN';
    }
    return promObject;
  } else {
    return `${metricName} NaN`;
  }
}

/**
 * Add a valid http observatory data as metrics, e.g:
 *
 * {
   "algorithm_version":2,
   "end_time":"Fri, 18 Jan 2019 09:46:07 GMT",
   "grade":"D",
   "hidden":false,
   "likelihood_indicator":"MEDIUM",
   "response_headers":{
      "Cache-Control":"no-cache, no-store, max-age=0, must-revalidate",
      "Content-Type":"application/json;charset=UTF-8",
      "Date":"Fri, 18 Jan 2019 09:46:05 GMT",
      "Expires":"0",
      "Pragma":"no-cache",
      "Set-Cookie":"556448b8f044ea9c0fe56ec8eabb3577=6dda08a289298b570c8daa5a12e94408; path=/; HttpOnly; Secure",
      "Transfer-Encoding":"chunked",
      "X-Application-Context":"application:prod:8087",
      "X-Content-Type-Options":"nosniff",
      "X-XSS-Protection":"1; mode=block"
   },
   "scan_id":9783173,
   "score":35,
   "start_time":"Fri, 18 Jan 2019 09:46:02 GMT",
   "state":"FINISHED",
   "status_code":404,
   "tests_failed":3,
   "tests_passed":9,
   "tests_quantity":12,
   "url":"sub.domain-sample.com"
}
 *
 *
 * @param {Object} dataAsJson
 * @param {Object} additionalMetadata - additional key-value based metadata
 */
function addMozillaMetric (dataAsJson, additionalMetadata) {
  const data = Object.assign({}, dataAsJson, additionalMetadata);
  if (resultStore[dataAsJson.url]) {
    resultStore[dataAsJson.url].moz = json2prom(mozillaMetricName, data);
  } else {
    resultStore[dataAsJson.url] = {
      moz: json2prom(mozillaMetricName, data)
    };
  }
}
/**
 *
{
  "status": 200|400|404,
  "valid": true,
  "days_remaining" : 90,
  "valid_from" : "issue date",
  "valid_to" : "expiry date"
}
 * @param {Object} dataAsJson - from ssl-checker
 * @param {Object} additionalMetadata - additional key-value based metadata
 */
function addDetailsMetric (dataAsJson, additionalMetadata) {
  const data = Object.assign({}, dataAsJson.valid ? {
    days_remaining: dataAsJson.daysRemaining,
    valid_from: dataAsJson.validFrom,
    valid_to: dataAsJson.validTo,
    valid: dataAsJson.valid
  } : dataAsJson, additionalMetadata);
  if (resultStore[dataAsJson.url]) {
    resultStore[dataAsJson.url].details = json2prom(sslDetailsMetricName, data);
  } else {
    resultStore[dataAsJson.url] = {
      details: json2prom(sslDetailsMetricName, data)
    };
  }
}
/**
 *
{
  "status": 200|400|404,
  "valid": true,
  "days_remaining" : 90,
  "valid_from" : "issue date",
  "valid_to" : "expiry date"
}
 * @param {Object} dataAsJson
 * @param {Object} additionalMetadata - additional key-value based metadata
 */
function addExpireMetric (dataAsJson, additionalMetadata) {
  const data = Object.assign({}, dataAsJson, additionalMetadata);
  if (resultStore[dataAsJson.url]) {
    resultStore[dataAsJson.url].expire = json2prom(sslExpireMetricName, data);
  } else {
    resultStore[dataAsJson.url] = {
      expire: json2prom(sslExpireMetricName, data)
    };
  }
}

/**
 *
 */
function updateHosts (updatedHosts) {
  // loop and update results with hosts
  Object.keys(resultStore).map((host) => {
    let found = false;
    updatedHosts.forEach((knownHost) => {
      if (host === knownHost) {
        found = true;
      }
    });
    if (!found) {
      delete resultStore[host];
    }
  });
}

/**
 * Check for unallowed raw data contains, e.g. undefined data and normalize it
 *
 * @param {*} rawData
 */
function normalizePrometheusDate (rawData) {
  if (rawData) {
    return `${rawData}\n`;
  } else {
    return '';
  }
}

function renderMetrics () {
  let response = '';
  response += `# HELP ${mozillaMetricName} Mozilla Observatory SSL stats\n`;
  Object.keys(resultStore).map((host) => {
    response += `${normalizePrometheusDate(resultStore[host].moz)}`;
  });
  response += `# HELP ${sslDetailsMetricName} Generic SSL Details\n`;
  Object.keys(resultStore).map((host) => {
    response += `${normalizePrometheusDate(resultStore[host].details)}`;
  });
  response += `# HELP ${sslExpireMetricName} Remaining Days before certificate expiry\n`;
  Object.keys(resultStore).map((host) => {
    response += `${normalizePrometheusDate(resultStore[host].expire)}`;
  });
  return response;
}

init();

module.exports = exports = {
  init: init,
  reset: init,
  updateHosts: updateHosts,
  addDetailsMetric: addDetailsMetric,
  addExpireMetric: addExpireMetric,
  addMozillaMetric: addMozillaMetric,
  renderMetrics: renderMetrics
};
