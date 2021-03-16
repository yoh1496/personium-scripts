import { prepareAdapter } from '../common/adapter';
import { PersoniumAccessToken } from '../common/types';

export async function getACL(cellUrl: string, token: string) {
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'PROPFIND',
    url: cellUrl,
  });

  return res.data;
}

export async function setAllReadACL(
  targetUrl: string,
  token: PersoniumAccessToken
) {
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'ACL',
    url: targetUrl,
    data: `<?xml version="1.0" encoding="utf-8" ?>
    <D:acl xmlns:D="DAV:">
      <D:ace>
        <D:principal>
          <D:all/>
        </D:principal>
        <D:grant>
          <D:privilege>
            <D:read/>
          </D:privilege>
        </D:grant>
      </D:ace>
    </D:acl>`,
  });

  return res.data;
}

// ToDo: modify
export async function setAdminACL(cellUrl: string, token: string) {
  const adapter = prepareAdapter(token);

  const res = await adapter({
    url: cellUrl,
    method: 'ACL',
    data: `<?xml version="1.0" encoding="utf-8" ?>
    <D:acl xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns" xml:base="${cellUrl}__role/__/">
      <D:ace>
        <D:principal>
          <D:href>admin</D:href>
        </D:principal>
        <D:grant>
          <D:privilege>
            <p:root/>
          </D:privilege>
        </D:grant>
      </D:ace>
    </D:acl>`,
  });
  return res.data;
}
