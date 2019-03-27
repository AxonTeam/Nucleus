// Node module
const Eris = require('eris');
// File
const config = require('../config.json');

const bot = new Eris.CommandClient(config.token, { 
    restMode: true,
    autoreconnect: true,
  }, {
    prefix: config.perfix || 'nuke ',
    defaultHelpCommand: false,
    defaultCommandOptions: {
      guildOnly: true
    }
})

module.exports = bot;