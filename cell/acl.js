
const { preapareAdapter, prepareAdapter } = require('../common/adapter');

async function getACL(cellUrl, token) {
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'PROPFIND',
    url: cellUrl,
  });

  return res.data;
}

// ToDo: modify
async function setACL(cellUrl, token) {
  const adapter = prepareAdapter(token);

  const res = await adapter({
    url: cellUrl,
    method: 'ACL',
    headers: Object.assign({}, adapter.defaults.headers, { "Content-Type": "application/json"}),
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

module.exports = {
  getACL, setACL,
}