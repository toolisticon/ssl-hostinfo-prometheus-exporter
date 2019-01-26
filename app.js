const CronJob = require('cron').CronJob;
const log = require('./lib/log');
const config = require('./lib/config');
const updateRoutesInfo = require('./.').updateRoutesInfo;
const startPrometheusListener = require('./.').startPrometheusListener;

async function triggerUpdate () {
  log.info('Start reading route information.');
  // start with provided url list
  updateRoutesInfo(config.urlsToCheck);
}

/* eslint no-new: "off" */
new CronJob(config.cron, () => {
  log.info(`Triggering check`);
  triggerUpdate();
}, null, true, 'UTC');

// trigger one update immediatly
triggerUpdate();

startPrometheusListener();
