const mozilla = require('../../lib/mozilla');

const hostname = 'google.com';

describe('mozilla', () => {
  /* eslint no-debugger: "off" */
  debugger;
  beforeEach(async () => {
    await mozilla.triggerScan(hostname, 443);
  });

  it('should get mozilla stats', async () => {
    // defer read results
    setTimeout(async () => {
      await mozilla.receiveScanResult(hostname, {});
    }, 500);
  });
});
