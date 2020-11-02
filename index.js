#!/usr/bin/env node

const { Command } = require('commander');
const { cellCreate, getCells } = require('./cell/create');
const { createAccount, getAccounts} = require('./account');
const create = require('./cell/create');
const { createRole, getRoles, assignRole, getAssignedRole } = require('./cell/role');
const { setACL, getACL } = require('./cell/acl');

async function createUserCell(unitFQDN, cellName, token) {

  await cellCreate(unitFQDN, cellName, token).then(res => {
    console.log(JSON.stringify(res));
  });

  await getCells(unitFQDN, token).then(res => {
    console.log(JSON.stringify(res));
  });

  await createAccount(unitFQDN, cellName, 'me', 'personium', token).then(res => {
    console.log(JSON.stringify(res));
  });

  await getAccounts(unitFQDN, cellName, token).then(res => {
    console.log(JSON.stringify(res));
  });

  const cellUrl = `https://${cellName}.${unitFQDN}/`;

  await createRole(cellUrl, 'admin', token).then(res => {
    console.log(JSON.stringify(res));
  });

  await getRoles(cellUrl, token).then(res => {
    console.log(JSON.stringify(res));
  });

  await assignRole(cellUrl, 'me', 'admin', token).then(res => {
    console.log(JSON.stringify(res));
  });

  await getAssignedRole(cellUrl, 'me', token).then(res => {
    console.log(JSON.stringify(res));
  });

  await setACL(cellUrl, token).then(res => {
    console.log(JSON.stringify(res));
  });

  await getACL(cellUrl, token).then(res => {
    console.log(JSON.stringify(res));
  });
}

const program = new Command();
program.version('0.0.1');

program
  .requiredOption('-c, --cell <string>' , 'cell name')
  .requiredOption('-u, --unit <unitFQDN>', 'unit FQDN')
  .requiredOption('-t, --token <masterToken>', 'master token');

program.parse(process.argv);

createUserCell(program.unit, program.cell, program.token);