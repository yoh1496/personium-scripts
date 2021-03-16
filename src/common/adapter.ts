import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  Method,
} from 'axios';
import { globalAgent } from 'https';

import HttpsProxyAgent from 'https-proxy-agent';

function getAgent(proxy_url = process.env.HTTPS_PROXY) {
  console.log({ proxy_url });
  if (!proxy_url || proxy_url === '') {
    return null;
  }
  try {
    const { hostname, port, username, password } = new URL(proxy_url);
    const auth = username && password && `${username}:${password}`;
    return HttpsProxyAgent({
      hostname,
      port,
      rejectUnauthorized: false,
    });
  } catch (e) {
    return globalAgent;
  }
}

const agent = getAgent();

type PersoniumMethod = Method | 'PROPFIND' | 'PROPPATCH' | 'ACL' | 'MKCOL';

// ToDo: 直す
interface _tmp extends AxiosRequestConfig {
  method: any;
}

interface PersoniumRequestOptions extends _tmp {
  method: PersoniumMethod;
}

interface PersoniumAdapterInterface extends AxiosInstance {
  (config: PersoniumRequestOptions): AxiosPromise;
  (url: string, config?: PersoniumRequestOptions): AxiosPromise;
}

export function prepareAdapter(
  token: string | null,
  additionalHeaders: null | {} = null
) {
  return axios.create({
    headers: Object.assign(
      {
        Accept: 'application/json',
      },
      token !== null ? { Authorization: `Bearer ${token}` } : null,
      additionalHeaders
    ),
    httpAgent: agent,
    httpsAgent: agent,
    proxy: false,
  }) as PersoniumAdapterInterface;
}
