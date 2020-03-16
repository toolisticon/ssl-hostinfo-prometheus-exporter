const extractHostnameAndPort = require('../../lib/url').extractHostnameAndPort;
const extractHostnamesAndPort = require('../../lib/url').extractHostnamesAndPort;

describe('extractHostnamesAndPort', () => {
  it('should work without ports', () => {
    const result = extractHostnameAndPort('url1');
    expect(result.domain).toBe('url1');
    expect(result.port).toBe('443');
  });

  it('should work with ports', () => {
    const result = extractHostnameAndPort('url1:4443');
    expect(result.domain).toBe('url1');
    expect(result.port).toBe('4443');
  });
});

describe('extractHostnamesAndPort', () => {
  it('should work without ports', () => {
    const result = extractHostnamesAndPort(['url1', 'url2']);
    expect(result[0].domain).toBe('url1');
    expect(result[0].port).toBe('443');
    expect(result[1].domain).toBe('url2');
    expect(result[1].port).toBe('443');
  });

  it('should work with ports', () => {
    const result = extractHostnamesAndPort(['url1:443', 'url2:8443']);
    expect(result[0].domain).toBe('url1');
    expect(result[0].port).toBe('443');
    expect(result[1].domain).toBe('url2');
    expect(result[1].port).toBe('8443');
  });

  it('should work with mixed content for ports', () => {
    const result = extractHostnamesAndPort(['url1', 'url2:8443']);
    expect(result[0].domain).toBe('url1');
    expect(result[0].port).toBe('443');
    expect(result[1].domain).toBe('url2');
    expect(result[1].port).toBe('8443');
  });
});
