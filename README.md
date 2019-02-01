# Monitor SSL certificates in Prometheus

[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)
[![Build Status](https://travis-ci.org/toolisticon/ssl-hostinfo-prometheus-exporter.svg?branch=master)](https://travis-ci.org/toolisticon/ssl-hostinfo-prometheus-exporter)
[![Build Status](https://jenkins.holisticon.de/buildStatus/icon?job=toolisticon/ssl-hostinfo-prometheus-exporter/master)](https://jenkins.holisticon.de/blue/organizations/jenkins/toolisticon%2Fssl-hostinfo-prometheus-exporter/branches/)
[![Docker Build Status](https://img.shields.io/docker/automated/toolisticon/ssl-hostinfo-prometheus-exporter.svg)](https://hub.docker.com/r/toolisticon/ssl-hostinfo-prometheus-exporter/)
[![npm version](https://badge.fury.io/js/%40toolisticon%2Fssl-hostinfo-prometheus-exporter.svg)](https://badge.fury.io/js/%40toolisticon%2Fssl-hostinfo-prometheus-exporter)
[![Docker Stars](https://img.shields.io/docker/stars/toolisticon/ssl-hostinfo-prometheus-exporter.svg)](https://hub.docker.com/r/toolisticon/ssl-hostinfo-prometheus-exporter/)
[![Greenkeeper badge](https://badges.greenkeeper.io/toolisticon/ssl-hostinfo-prometheus-exporter.svg)](https://greenkeeper.io/)

> Still **WIP**


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

The metrics are available via via localhost:9000 :

```
security_ssl_mozilla_observatory{algorithm_version="2",end_time="1547804767000",grade="D",hidden="false",likelihood_indicator="MEDIUM",response_headers_cache-control="no-cache, no-store, max-age=0, must-revalidate",response_headers_content-type="996616800000",response_headers_date="1547804765000",response_headers_expires="946681200000",response_headers_pragma="no-cache",response_headers_set-cookie="556448b8f044ea9c0fe56ec8eabb3577=6dda08a289298b570c8daa5a12e94408; path=/; HttpOnly; Secure",response_headers_transfer-encoding="chunked",response_headers_x-application-context="193033926000000",response_headers_x-content-type-options="nosniff",response_headers_x-xss-protection="1; mode=block",scan_id="9783173",score="35",start_time="1547804762000",state="FINISHED",status_code="404",tests_failed="3",tests_passed="9",tests_quantity="12",url="sub.domain-sample.com",security_ssl_mozilla_observatory{algorithm_version="2",end_time="1547804767000",grade="D",hidden="false",likelihood_indicator="MEDIUM",response_headers_cache-control="no-cache, no-store, max-age=0, must-revalidate",response_headers_content-type="996616800000",response_headers_date="1547804765000",response_headers_expires="946681200000",response_headers_pragma="no-cache",response_headers_set-cookie="556448b8f044ea9c0fe56ec8eabb3577=6dda08a289298b570c8daa5a12e94408; path=/; HttpOnly; Secure",response_headers_transfer-encoding="chunked",response_headers_x-application-context="193033926000000",response_headers_x-content-type-options="nosniff",response_headers_x-xss-protection="1; mode=block",scan_id="9783173",score="35",start_time="1547804762000",state="FINISHED",status_code="404",tests_failed="3",tests_passed="9",tests_quantity="12",url="sub1.domain-sample.com",} 35
security_ssl_mozilla_observatory{algorithm_version="2",end_time="1547804767000",grade="D",hidden="false",likelihood_indicator="MEDIUM",response_headers_cache-control="no-cache, no-store, max-age=0, must-revalidate",response_headers_content-type="996616800000",response_headers_date="1547804765000",response_headers_expires="946681200000",response_headers_pragma="no-cache",response_headers_set-cookie="556448b8f044ea9c0fe56ec8eabb3577=6dda08a289298b570c8daa5a12e94408; path=/; HttpOnly; Secure",response_headers_transfer-encoding="chunked",response_headers_x-application-context="193033926000000",response_headers_x-content-type-options="nosniff",response_headers_x-xss-protection="1; mode=block",scan_id="9783173",score="35",start_time="1547804762000",state="FINISHED",status_code="404",tests_failed="3",tests_passed="9",tests_quantity="12",url="sub.domain-sample.com",security_ssl_mozilla_observatory{algorithm_version="2",end_time="1547804767000",grade="D",hidden="false",likelihood_indicator="MEDIUM",response_headers_cache-control="no-cache, no-store, max-age=0, must-revalidate",response_headers_content-type="996616800000",response_headers_date="1547804765000",response_headers_expires="946681200000",response_headers_pragma="no-cache",response_headers_set-cookie="556448b8f044ea9c0fe56ec8eabb3577=6dda08a289298b570c8daa5a12e94408; path=/; HttpOnly; Secure",response_headers_transfer-encoding="chunked",response_headers_x-application-context="193033926000000",response_headers_x-content-type-options="nosniff",response_headers_x-xss-protection="1; mode=block",scan_id="9783173",score="35",start_time="1547804762000",state="FINISHED",status_code="404",tests_failed="3",tests_passed="9",tests_quantity="12",url="sub2.domain-sample.com",} 35
```

## Configuration

You can override the config via environment variables:
```
   URLS_TO_CHECK: // list of urls
   SERVER_PORT: // set desired port for prometheus endpoint, defaults to 9000
   CRON: // set cron pattern, default is '0 0 * * * *',
   LOG_LEVEL: // set log level, default is 'ERROR' ('INFO' outputs details info)
```

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
