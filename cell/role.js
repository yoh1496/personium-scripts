const account = require('../account');
const { preapareAdapter, prepareAdapter } = require('../common/adapter');

async function getRoles(cellUrl, token) {
  const url = `${cellUrl}__ctl/Role`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'GET',
    url,
  });

  return res.data;
}

async function createRole(cellUrl, roleName, token) {
  const url = `${cellUrl}__ctl/Role`;
  const adapter = prepareAdapter(token);
  const res = await adapter({
    method: "POST",
    url,
    data: { Name: roleName},
  });
  return res.data;
}

async function assignRole(cellUrl, accountName, roleName, token) {
  const url = `${cellUrl}__ctl/Role('${roleName}')/$links/_Account`;
  const adapter = prepareAdapter(token);
  const res = await adapter({
    method: "POST",
    url,
    data: { uri: `${cellUrl}__ctl/Account('${accountName}')`},
  });
  return res.data;
}

async function getAssignedRole(cellUrl, accountName, token) {
  const url = `${cellUrl}__ctl/Account('${accountName}')`;
  const adapter = prepareAdapter(token);
  const res = await adapter({
    method: 'GET',
    url,
  });
  console.log(res.data);
  const roleUrl = res.data.d.results._Role.__deferred.uri;
  console.log(roleUrl);
  const resRole = await adapter(
    {method: 'GET', url: roleUrl}
  );
  return resRole.data;
}

module.exports = {
  getRoles, createRole, assignRole, getAssignedRole
}