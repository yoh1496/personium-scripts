
import { prepareAdapter } from '../common/adapter';

export async function getAccounts(unitFQDN: string, cellName: string, token: string) {
  const url = `https://${cellName}.${unitFQDN}/__ctl/Account`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'GET',
    url,
  });

  return res.data;
}

export async function createAccount(unitFQDN: string, cellName: string, accountName: string, accountPassword: string, token: string) {
  const url = `https://${cellName}.${unitFQDN}/__ctl/Account`;
  const adapter = prepareAdapter(token);
  const res = await adapter({
    method: "POST",
    url,
    data: { Name: accountName },
    headers: Object.assign({}, adapter.defaults.headers, { "X-Personium-Credential": accountPassword })
  });

  return res.data;
}

