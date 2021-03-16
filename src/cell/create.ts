
import { prepareAdapter } from '../common/adapter';
// const agent = HttpsProxyAgent(new URL('http://localhost:18080/'));

export async function getCells(unitFQDN: string, token: string) {
  const url = `https://${unitFQDN}/__ctl/Cell`;
  const adapter = prepareAdapter(token);

  return (await adapter({
    method: "GET", url,
  })).data;
}

export async function deleteCell(unitFQDN: string, cellName: string, token: string) {
  const url = `https://${cellName}.${unitFQDN}/`;
  const adapter = prepareAdapter(token, { "X-Personium-Recursive": 'true' });

  const res = await adapter({
    url,
    method: "DELETE",
  });

  return res.data;
}

export async function cellCreate(unitFQDN: string, cellName: string, token: string) {
  const url = `https://${unitFQDN}/__ctl/Cell`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    url,
    method: "POST",
    data: { Name: cellName },
  });

  return res.data;
}
