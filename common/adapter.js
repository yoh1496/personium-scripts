
const axios = require('axios').default;
const https = require('https');
// const { agent } = require('../net');

const HttpsProxyAgent = require('https-proxy-agent');

const agent = HttpsProxyAgent({
  hostname: "localhost",
  port: 18080,
  rejectUnauthorized: false,
});

function prepareAdapter(token) {
  return axios.create(
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    httpAgent: agent,
    httpsAgent: agent,
    proxy: false
  });
}

module.exports = {
  prepareAdapter
}