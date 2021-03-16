#!/usr/bin/env node

import { Command } from 'commander';
import { cellCreate, getCells, deleteCell } from './cell/create';
import { createAccount, getAccounts } from './account';
import { createRole, getRoles, assignRole, getAssignedRole } from './cell/role';
import { setAdminACL, getACL, setAllReadACL } from './cell/acl';
import {
  authWithROPC,
  authWithUnitAdmin,
  getTranscellTokenByRefreshToken,
} from './cell/auth';
import { getRelation, getRelationExtCell } from './cell/relation';
import { configureService } from './box/collections';
import { getExtCells, getExtCell } from './cell/extcell';
import { generateSVG } from './utils/avatar';
import { putData } from './box/putData';

async function createUserCell(
  unitFQDN: string,
  cellName: string,
  token: string
) {
  await cellCreate(unitFQDN, cellName, token).then((res) => {
    console.log(JSON.stringify(res));
  });

  await getCells(unitFQDN, token).then((res) => {
    console.log(JSON.stringify(res));
  });

  await createAccount(unitFQDN, cellName, 'me', 'personium', token).then(
    (res) => {
      console.log(JSON.stringify(res));
    }
  );

  await getAccounts(unitFQDN, cellName, token).then((res) => {
    console.log(JSON.stringify(res));
  });

  const cellUrl = `https://${cellName}.${unitFQDN}/`;

  await createRole(cellUrl, 'admin', token).then((res) => {
    console.log(JSON.stringify(res));
  });

  await getRoles(cellUrl, token).then((res) => {
    console.log(JSON.stringify(res));
  });

  await assignRole(cellUrl, 'me', 'admin', token).then((res) => {
    console.log(JSON.stringify(res));
  });

  await getAssignedRole(cellUrl, 'me', token).then((res) => {
    console.log(JSON.stringify(res));
  });

  await setAdminACL(cellUrl, token).then((res) => {
    console.log(JSON.stringify(res));
  });

  await getACL(cellUrl, token).then((res) => {
    console.log(JSON.stringify(res));
  });
}

const program = new Command();
program.version('0.0.1');

program
  .command('dummy_profile <unitfqdn> <cellname> <celluser> <cellpass>')
  .description('add dummy profile')
  .action(async (unit, cell, cellUser, cellPass) => {
    const cellUrl = `https://${cell}.${unit}/`;
    const tokens = await authWithROPC(cellUrl, cellUser, cellPass);

    const profileImg = generateSVG(cell);
    const profileData = {
      DisplayName: cell,
      Description: 'This is dummy profile.',
      Image: profileImg,
    };
    await putData(
      `${cellUrl}__/profile.json`,
      JSON.stringify(profileData),
      tokens.access_token
    ).then(console.log);

    try {
      await setAllReadACL(
        `${cellUrl}__/profile.json`,
        tokens.access_token
      ).then(console.log);
    } catch (e) {
      console.log(e);
    }
  });

program
  .command('configure_service <serviceurl> <user> <pass> <subject>')
  .description('Configure Service Subject')
  .action(async (serviceUrl, cellUser, cellPass, subject) => {
    const cellUrl = `${new URL(serviceUrl).origin}/`;
    const tokens = await authWithROPC(cellUrl, cellUser, cellPass);
    console.log(tokens);
    configureService(
      serviceUrl,
      tokens.access_token,
      'JavaScript',
      new Map(),
      subject
    ).then(console.log);
  });

program
  .command('auth <unitfqdn> <cellname> <celluser> <cellpass>')
  .description('Authentication with ROPC')
  .action(async (unit, cell, cellUser, cellPass) => {
    const cellUrl = `https://${cell}.${unit}/`;
    const tokens = await authWithROPC(cellUrl, cellUser, cellPass);
    console.log(tokens);
  });

program
  .command(
    'transcell_auth <unitfqdn> <cellname> <celluser> <cellpass> <targetcellurl>'
  )
  .description('Authentication with ROPC (trans-cell token)')
  .action(async (unit, cell, cellUser, cellPass, targetCellUrl) => {
    const cellUrl = `https://${cell}.${unit}/`;
    const tokens = await authWithROPC(cellUrl, cellUser, cellPass);
    const { refresh_token } = tokens;
    const transcell_tokens = await getTranscellTokenByRefreshToken(
      cellUrl,
      refresh_token,
      targetCellUrl
    );
    console.log(transcell_tokens);
  });

program
  .command('get_ext_cells <unitfqdn> <cellname> <celluser> <cellpass>')
  .description('Get ExtCells')
  .action(async (unit, cell, cellUser, cellPass) => {
    const cellUrl = `https://${cell}.${unit}/`;
    const tokens = await authWithROPC(cellUrl, cellUser, cellPass);
    const extCellList = await getExtCells(cellUrl, tokens.access_token);
    console.log(JSON.stringify(extCellList));
  });

program
  .command('get_ext_cell <cellurl> <celluser> <cellpass> <extcellurl>')
  .description('Get ExtCell by URL')
  .action(async (cellUrl, cellUser, cellPass, extCellUrl) => {
    const tokens = await authWithROPC(cellUrl, cellUser, cellPass);
    const extCell = await getExtCell(cellUrl, extCellUrl, tokens.access_token);
    console.log(JSON.stringify(extCell));
  });

program
  .command(
    'get_ext_cell_by_relation <unitfqdn> <cellname> <celluser> <cellpass> <role>'
  )
  .description('Get ExtCells by Relation')
  .action(async (unit, cell, cellUser, cellPass, Relation) => {
    const cellUrl = `https://${cell}.${unit}/`;
    const tokens = await authWithROPC(cellUrl, cellUser, cellPass);
    console.log(tokens);
    const relData = await getRelation(
      cellUrl,
      tokens.access_token,
      'rel_minsei'
    );
    console.log(relData);
    const extCellData = await getRelationExtCell(relData, tokens.access_token);
    console.log(extCellData);
  });

program
  .command('create_cell <unitfqdn> <cellname> <adminuser> <adminpass>')
  .description('Add new cell to unit')
  .action(async (unit, cell, adminUser, adminPass) => {
    const tokens = await authWithUnitAdmin(
      unit,
      adminUser,
      adminUser,
      adminPass
    );
    console.log(tokens);
    await createUserCell(unit, cell, tokens.access_token).catch(console.log);
  });

program
  .command('delete_cell <unitfqdn> <cellname> <adminuser> <adminpass>')
  .description('Delete cell')
  .action(async (unit, cell, adminUser, adminPass) => {
    const tokens = await authWithUnitAdmin(
      unit,
      adminUser,
      adminUser,
      adminPass
    );
    await deleteCell(unit, cell, tokens.access_token).catch(console.log);
  });

//   program
//   .requiredOption('-c, --cell <string>' , 'cell name')
//   .requiredOption('-u, --unit <unitFQDN>', 'unit FQDN')
//   .requiredOption('-t, --token <masterToken>', 'master token');

program.parse(process.argv);

// getCells(program.unit, program.token).then(res => {
//   console.log(JSON.stringify(res));
// });
// createUserCell(program.unit, program.cell, program.token);
