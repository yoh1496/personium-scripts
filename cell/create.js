
const { prepareAdapter } = require('../common/adapter');
// const agent = HttpsProxyAgent(new URL('http://localhost:18080/'));
async function getCells(unitFQDN, token) {
  const url = `https://${unitFQDN}/__ctl/Cell`;
  const adapter = prepareAdapter(token);

  return (await adapter({
    method:"GET",  url,
  })).data;
}

async function cellCreate (unitFQDN, cellName, token) {
  const url = `https://${unitFQDN}/__ctl/Cell`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    url,
    method: "POST",
    data: { Name: cellName},
  });

  return res.data;
}

module.exports = {
  getCells, cellCreate
}