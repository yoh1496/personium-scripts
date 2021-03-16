
import { prepareAdapter } from '../common/adapter';
import { PersoniumAccessToken, PersoniumCellURL, PersoniumRelationData } from '../common/types';

export async function getRelations(cellUrl: string, token: string) {
  const url = `${cellUrl}__ctl/Relation`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'GET',
    url,
  });

  return res.data;
}

export async function getRelation(cellUrl: PersoniumCellURL, token: PersoniumAccessToken, relationName: string) {
  const url = `${cellUrl}__ctl/Relation('${relationName}')`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'GET',
    url,
  });

  return res.data;
}

export async function getRelationExtCell(relationData: PersoniumRelationData, token: PersoniumAccessToken) {
  const adapter = prepareAdapter(token);
  const res = await adapter({
    method: 'GET',
    url: relationData._ExtCell.__deferred.uri,
  });
  return res.data;
}
