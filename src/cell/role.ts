
const { preapareAdapter, prepareAdapter } = require('../common/adapter');

export async function getRoles(cellUrl: string, token: string) {
  const url = `${cellUrl}__ctl/Role`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'GET',
    url,
  });

  return res.data;
}

export async function createRole(cellUrl: string, roleName: string, token: string) {
  const url = `${cellUrl}__ctl/Role`;
  const adapter = prepareAdapter(token);
  const res = await adapter({
    method: "POST",
    url,
    data: { Name: roleName },
  });
  return res.data;
}

export async function assignRole(cellUrl: string, accountName: string, roleName: string, token: string) {
  const url = `${cellUrl}__ctl/Role('${roleName}')/$links/_Account`;
  const adapter = prepareAdapter(token);
  const res = await adapter({
    method: "POST",
    url,
    data: { uri: `${cellUrl}__ctl/Account('${accountName}')` },
  });
  return res.data;
}

export async function getAssignedRole(cellUrl: string, accountName: string, token: string) {
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
    { method: 'GET', url: roleUrl }
  );
  return resRole.data;
}
