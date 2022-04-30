
function extractHostnameAndPort (url) {
  const urlParts = url.split(':');
  if (urlParts.length > 1) {
    return {
      domain: urlParts[0],
      port: urlParts[1]
    };
  } else {
    return {
      domain: url,
      port: '443'
    };
  }
}

function extractHostnamesAndPort (urlList) {
  const result = [];
  if (urlList) {
    urlList.forEach(url => {
      result.push(extractHostnameAndPort(url));
    });
  }
  return result;
}

module.exports = exports = {
  extractHostnameAndPort,
  extractHostnamesAndPort
};
