const fs = require('fs');
const path = require('path')
const purge = require('./silentPurge');
const tokenMaker = require('../../token/token');

const peth = path.join(__dirname, '../../nucleusToken.json');

async function genToken() {
    await purge('Nucleus');
    const token = await tokenMaker('Nucleus');
    const data = { token };
    fs.writeFileSync(`${peth}`, JSON.stringify(data) );
    console.log('Nucleus token written!');
    return true;
}

module.exports = genToken;
