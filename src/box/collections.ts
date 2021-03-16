
import xml2js from 'xml2js';
import { prepareAdapter } from '../common/adapter';
import { PersoniumAccessToken, PersoniumBoxURL, PersoniumCellURL } from '../common/types';

type PersoniumCollectionType = "service";

type PersoniumServiceEndpointConfig = {
  name: string;
  src: string;
}

type PersoniumServiceConfig = {
  language: string;
  subject: string;
  endPoints: Map<string, string>;
}

export function prepareBody(collectionType: PersoniumCollectionType) {
  const additionalTag = collectionType === 'service' ? '<p:service/>' : '';
  const body = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<D:mkcol xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns">',
    '<D:set>',
    '<D:prop>',
    '<D:resourcetype>',
    '<D:collection/>',
    additionalTag,
    '</D:resourcetype>',
    '</D:prop>',
    '</D:set>',
    '</D:mkcol>',
  ];
  return body.join('');
}

export function buildServiceConfigXML({ language, subject, endPoints }: PersoniumServiceConfig) {
  const builder = new xml2js.Builder({
    rootName: 'D:propertyupdate',
    xmldec: { version: '1.0', encoding: 'UTF-8' },
    renderOpts: { newline: '', indent: '' },
  });
  const paths = Object.entries(endPoints).map(([name, src]) => ({
    $: { name, src },
  }));
  return builder.buildObject({
    $: { 'xmlns:D': 'DAV:', 'xmlns:p': 'urn:x-personium:xmlns' },
    'D:set': {
      'D:prop': {
        'p:service': {
          $: { language, subject },
          'p:path': paths,
        },
      },
    },
  });
}

export async function createDirectory(boxUrl: PersoniumBoxURL, collectionName: string, token: PersoniumAccessToken, isService: boolean) {
  const url = `${boxUrl}${collectionName}`;
  const adapter = prepareAdapter(token, { "Content-Type": "application/xml" });

  const collectionType = isService ? "service" : "service";
  const data = prepareBody(collectionType);

  const res = await adapter({
    method: 'MKCOL',
    url,
    data
  });

  return res.data;
}

export async function configureService(serviceCollectionUrl: string, token: PersoniumAccessToken, language: string, endPoints: Map<string, string>, serviceSubject: string) {
  const url = serviceCollectionUrl;
  const adapter = prepareAdapter(token, { "Content-Type": "application/xml" });

  const data = buildServiceConfigXML({ language, endPoints, subject: serviceSubject });

  const res = await adapter({
    method: 'PROPPATCH',
    url,
    data
  });

  return res.data;
}

module.exports = {
  configureService
}