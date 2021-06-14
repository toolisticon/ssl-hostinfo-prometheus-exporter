const mozilla = require('../../lib/mozilla');

const hostname = 'google.com';

describe('mozilla', () => {
  /* eslint no-debugger: "off" */
  debugger;
  beforeEach(async (done) => {
    await mozilla.triggerScan(hostname, 443);
    done();
  });

  it('should get mozilla stats', (done) => {
    // defer read results
    setTimeout(async () => {
      await mozilla.receiveScanResult(hostname, {});
      done();
    }, 500);
  });
});
