
const { preapareAdapter, prepareAdapter } = require('../common/adapter');

async function getAccounts(unitFQDN, cellName, token) {
  const url = `https://${cellName}.${unitFQDN}/__ctl/Account`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'GET',
    url,
  });

  return res.data;
}

async function createAccount(unitFQDN, cellName, accountName, accountPassword, token) {
  const url = `https://${cellName}.${unitFQDN}/__ctl/Account`;
  const adapter = prepareAdapter(token);
  console.log(adapter.defaults.headers);
  const res = await adapter({
    method: "POST",
    url,
    data: { Name: accountName},
    headers: Object.assign({}, adapter.defaults.headers, { "X-Personium-Credential": accountPassword})
  });

  return res.data;
}

module.exports = {
  getAccounts, createAccount
}