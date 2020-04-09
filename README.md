# Monitor SSL certificates in Prometheus

[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)
[![Build Status](https://travis-ci.org/toolisticon/ssl-hostinfo-prometheus-exporter.svg?branch=master)](https://travis-ci.org/toolisticon/ssl-hostinfo-prometheus-exporter)
[![Docker Build Status](https://img.shields.io/docker/automated/toolisticon/ssl-hostinfo-prometheus-exporter.svg)](https://hub.docker.com/r/toolisticon/ssl-hostinfo-prometheus-exporter/)
[![npm version](https://badge.fury.io/js/%40toolisticon%2Fssl-hostinfo-prometheus-exporter.svg)](https://badge.fury.io/js/%40toolisticon%2Fssl-hostinfo-prometheus-exporter)
[![npm downloads](https://img.shields.io/npm/dm/%40toolisticon%2Fssl-hostinfo-prometheus-exporter.svg)](https://www.npmjs.com/package/%40toolisticon%2Fssl-hostinfo-prometheus-exporter)
[![npm downloads](https://img.shields.io/npm/dt/%40toolisticon%2Fssl-hostinfo-prometheus-exporter.svg)](https://www.npmjs.com/package/%40toolisticon%2Fssl-hostinfo-prometheus-exporter)
[![Docker Stars](https://img.shields.io/docker/stars/toolisticon/ssl-hostinfo-prometheus-exporter.svg)](https://hub.docker.com/r/toolisticon/ssl-hostinfo-prometheus-exporter/)

## Usage

Install the app first
```
npm i -g @toolisticon/ssl-hostinfo-prometheus-exporter
```

This nodejs application assumes that you define a list of urls to check via environment variables:

```
export URLS_TO_CHECK=app1.sample.com,app2.sample.com
ssl-hostinfo-prom
```

## Sample Values

The metrics are available via via localhost:9000 :

```
security_ssl_mozilla_observatory{algorithm_version="2",end_time="1547804767000",grade="D",hidden="false",likelihood_indicator="MEDIUM",response_headers_cache-control="no-cache, no-store, max-age=0, must-revalidate",response_headers_content-type="996616800000",response_headers_date="1547804765000",response_headers_expires="946681200000",response_headers_pragma="no-cache",response_headers_set-cookie="556448b8f044ea9c0fe56ec8eabb3577=6dda08a289298b570c8daa5a12e94408; path=/; HttpOnly; Secure",response_headers_transfer-encoding="chunked",response_headers_x-application-context="193033926000000",response_headers_x-content-type-options="nosniff",response_headers_x-xss-protection="1; mode=block",scan_id="9783173",score="35",start_time="1547804762000",state="FINISHED",status_code="404",tests_failed="3",tests_passed="9",tests_quantity="12",url="sub.domain-sample.com",security_ssl_mozilla_observatory{algorithm_version="2",end_time="1547804767000",grade="D",hidden="false",likelihood_indicator="MEDIUM",response_headers_cache-control="no-cache, no-store, max-age=0, must-revalidate",response_headers_content-type="996616800000",response_headers_date="1547804765000",response_headers_expires="946681200000",response_headers_pragma="no-cache",response_headers_set-cookie="556448b8f044ea9c0fe56ec8eabb3577=6dda08a289298b570c8daa5a12e94408; path=/; HttpOnly; Secure",response_headers_transfer-encoding="chunked",response_headers_x-application-context="193033926000000",response_headers_x-content-type-options="nosniff",response_headers_x-xss-protection="1; mode=block",scan_id="9783173",score="35",start_time="1547804762000",state="FINISHED",status_code="404",tests_failed="3",tests_passed="9",tests_quantity="12",url="sub1.domain-sample.com",} 35
security_ssl_mozilla_observatory{algorithm_version="2",end_time="1547804767000",grade="D",hidden="false",likelihood_indicator="MEDIUM",response_headers_cache-control="no-cache, no-store, max-age=0, must-revalidate",response_headers_content-type="996616800000",response_headers_date="1547804765000",response_headers_expires="946681200000",response_headers_pragma="no-cache",response_headers_set-cookie="556448b8f044ea9c0fe56ec8eabb3577=6dda08a289298b570c8daa5a12e94408; path=/; HttpOnly; Secure",response_headers_transfer-encoding="chunked",response_headers_x-application-context="193033926000000",response_headers_x-content-type-options="nosniff",response_headers_x-xss-protection="1; mode=block",scan_id="9783173",score="35",start_time="1547804762000",state="FINISHED",status_code="404",tests_failed="3",tests_passed="9",tests_quantity="12",url="sub.domain-sample.com",security_ssl_mozilla_observatory{algorithm_version="2",end_time="1547804767000",grade="D",hidden="false",likelihood_indicator="MEDIUM",response_headers_cache-control="no-cache, no-store, max-age=0, must-revalidate",response_headers_content-type="996616800000",response_headers_date="1547804765000",response_headers_expires="946681200000",response_headers_pragma="no-cache",response_headers_set-cookie="556448b8f044ea9c0fe56ec8eabb3577=6dda08a289298b570c8daa5a12e94408; path=/; HttpOnly; Secure",response_headers_transfer-encoding="chunked",response_headers_x-application-context="193033926000000",response_headers_x-content-type-options="nosniff",response_headers_x-xss-protection="1; mode=block",scan_id="9783173",score="35",start_time="1547804762000",state="FINISHED",status_code="404",tests_failed="3",tests_passed="9",tests_quantity="12",url="sub2.domain-sample.com",} 35
```

[Here](https://grafana.com/dashboards/10144) you'll find a sample dashboard.

## Configuration

You can override the config via environment variables:
```
   URLS_TO_CHECK: // list of urls
   SERVER_PORT: // set desired port for prometheus endpoint, defaults to 9000
   CRON: // set cron pattern, default is '0 0 * * * *',
   LOG_LEVEL: // set log level, default is 'ERROR' ('INFO' outputs details info),
   CONSOLE_LOG: // set to true to omit logging to file, otherwise logs will be written to `logs` dir
```

Sample:
```
URLS_TO_CHECK=url1.sample.com,url2.sample.com:8443 LOG_LEVEL=INFO CONSOLE_LOG=true node app.js
```
Will produce the following output:
```
{"pid":65072,"msg":"[log4bro] Logger is: in-prod=false, in-docker:true, level=DEBUG, skipDebug=false","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:20.443Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
{"pid":65072,"msg":"Start reading route information.","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:20.563Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
{"pid":65072,"msg":"Triggering scan for url1.sample.com,url2.sample.com","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:20.563Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
{"pid":65072,"msg":"Triggering scan for url1.sample.com","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:20.563Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
{"pid":65072,"msg":"Triggering scan for url2.sample.com","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:20.566Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
{"pid":65072,"msg":"prometheus-exporter listening at 9000","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:20.569Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
{"pid":65072,"msg":"Reading scan results for url1.sample.com","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:20.769Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
{"pid":65072,"msg":"Reading scan results for url2.sample.com","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:20.770Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
{"pid":65072,"msg":"Skipping invalid response for mozilla scoring","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:21.206Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
{"pid":65072,"msg":"Skipping invalid response for mozilla scoring","loglevel":"INFO","loglevel_value":30,"@timestamp":"2019-04-02T13:56:21.208Z","host":"MPB-M1.local","log_type":"application","application_type":"service"}
```

And
```
URLS_TO_CHECK=url1.sample.com,url2.sample.com LOG_LEVEL=INFO node app.js
```
creates this output:
```
INFO @ 2019-04-02T13:57:42.181Z : [log4bro] Logger is: in-prod=false, in-docker:false, level=DEBUG, skipDebug=false
INFO @ 2019-04-02T13:57:42.301Z : Start reading route information.
INFO @ 2019-04-02T13:57:42.301Z : Triggering scan for url1.sample.com,url2.sample.com
INFO @ 2019-04-02T13:57:42.301Z : Triggering scan for url1.sample.com
INFO @ 2019-04-02T13:57:42.304Z : Triggering scan for url2.sample.com
INFO @ 2019-04-02T13:57:42.307Z : prometheus-exporter listening at 9000
INFO @ 2019-04-02T13:57:42.507Z : Reading scan results for url1.sample.com
INFO @ 2019-04-02T13:57:42.508Z : Reading scan results for url2.sample.com
INFO @ 2019-04-02T13:57:43.001Z : Skipping invalid response for mozilla scoring
INFO @ 2019-04-02T13:57:43.024Z : Skipping invalid response for mozilla scoring
```
and the logs in JSON format within the directy `logs`

>NOTE: You can omit the port, it will default to 443.

## Troubleshooting

TBD

## Development

### Usage as library

The package can be also used as a dependency:


```
npm i @toolisticon/ssl-hostinfo-prometheus-exporter
```

In your app you can use then the api:

```
const updateRoutesInfo = require('@toolisticon/ssl-hostinfo-prometheus-exporter').updateRoutesInfo;
const startPrometheusListener = require('@toolisticon/ssl-hostinfo-prometheus-exporter').startPrometheusListener;

// trigger one update immediatly
triggerUpdate();

startPrometheusListener();

```


### Debug

To debug run the following command:
```
node --inspect-brk index.js
```

To debug unit tests:

```
npm run test:debug
```
