import { prepareAdapter } from '../common/adapter';
import { PersoniumAccessToken } from '../common/types';

export async function putData(
  targetUrl: string,
  body: string,
  accessToken: PersoniumAccessToken
) {
  const adapter = prepareAdapter(accessToken);

  const res = await adapter({
    method: 'PUT',
    url: targetUrl,
    data: body,
  });

  return res.data;
}
