
describe('config', () => {
  /* eslint no-debugger: "off" */
  debugger;

  it('should parse valid url list', () => {
    process.env.URLS_TO_CHECK = 'url1,url2';
    const config = require('../lib/config');
    expect(config.urlsToCheck.length).toBe(2);
  });
});
