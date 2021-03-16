
import { prepareAdapter } from '../common/adapter';

export async function authWithUnitAdmin(unitFQDN: string, adminCellName: string, adminUser: string, adminPass: string) {
  const url = `https://${adminCellName}.${unitFQDN}/__token`;
  const adapter = prepareAdapter(null, { 'Content-Type': 'application/x-www-form-urlencoded' });

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', adminUser);
  params.append('password', adminPass);
  params.append('p_target', `https://${unitFQDN}/`);

  console.log(url);

  const res = await adapter({
    method: 'POST',
    url,
    data: params
  }).catch(err => {
    console.log(err);
    throw err;
  });


  return res.data;
}

export async function authWithROPC(cellUrl: string, username: string, password: string) {
  const url = `${cellUrl}__token`;
  const adapter = prepareAdapter(null, { 'Content-Type': 'application/x-www-form-urlencoded' });

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);

  const res = await adapter({
    method: 'POST',
    url,
    data: params
  });

  return res.data;
}

export async function getTranscellTokenByRefreshToken(cellUrl: string, refresh_token: string, p_target: string) {
  const url = `${cellUrl}__token`;
  const adapter = prepareAdapter(null, { 'Content-Type': 'application/x-www-form-urlencoded' });

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refresh_token);
  params.append('p_target', p_target);

  const res = await adapter({
    method: 'POST',
    url,
    data: params
  });

  return res.data;
}
