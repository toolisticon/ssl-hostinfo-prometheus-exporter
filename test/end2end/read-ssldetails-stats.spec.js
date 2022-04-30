const axios = require('axios');

const url = 'http://localhost:9090/api/v1/query?query=security_ssl_details';

describe('ssl details stats', () => {
  /* eslint no-debugger: "off" */
  debugger;

  it('read', (done) => {
    axios.get(url).then(res => {
      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
      done();
    });
  });

  it('structure', (done) => {
    axios.get(url).then(res => {
      const metricsResults = res.data.data.result;
      expect(metricsResults.length).toBeGreaterThanOrEqual(1);
      expect(metricsResults[0].metric.__name__).toBe('security_ssl_details');
      done();
    });
  });
});
