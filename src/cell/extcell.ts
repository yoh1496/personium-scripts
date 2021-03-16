import { prepareAdapter } from '../common/adapter';

export async function getExtCells(cellUrl: string, token: string) {
  const url = `${cellUrl}__ctl/ExtCell`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'GET',
    url,
  });

  return res.data;
}

export async function getExtCell(cellUrl: string, extCellUrl: string, token: string) {
  const url = `${cellUrl}__ctl/ExtCell('${encodeURIComponent(extCellUrl)}')`;
  const adapter = prepareAdapter(token);

  const res = await adapter({
    method: 'GET',
    url,
  });

  return res.data;
}
