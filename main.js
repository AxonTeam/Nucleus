const mongoose = require('mongoose')
const fs = require('fs');

const bot = require('./bot/bot');
const config = require('./config');
const genNucleusToken = require('./bot/functions/genNucleusToken');

if (!fs.existsSync('./nucleusToken.json') ) {
    fs.writeFileSync('./nucleusToken.json', JSON.stringify( { token: 'Fake token' } ) );
}

mongoose.connect('mongodb://localhost/AxonTeam', {
    useCreateIndex: true,
    autoReconnect: true,
    useNewUrlParser: true,
});

const db = mongoose.connection;

db.once('connect', () => console.log('Connected to AxonTeam database!') );
db.on('error', () => {
    console.error.bind(console, 'Connection error:');
    process.exit();
} );

function initCommand(command) {
    if (bot.commands[command.label]) {
        throw Error(`InitCommands - Command ${command.label} has already been registered!`);
    }
    bot.registerCommand(command.label, command.execute, command.options);
    const cmd = bot.commands[command.label];
    if (!command.options.flags) {
        command.options.flags = [];
    } if (!command.options.subcommands) {
        command.options.subcommands = [];
    }
    cmd.options = command.options;
    console.log(`BOT - Loaded command ${command.label}!`);
}

function initCommands() {
    const cmds = './bot/commands/';
    const commands = fs.readdirSync(cmds);
    for (let command of commands) {
        command = require(`./bot/commands/${command}`)(bot);
        initCommand(command);
    }
    console.log('BOT - Initated commands!');
}

initCommands();

const prefix = config.prefix || 'nuke ';
const status = config.status || 'AxonTeam Manager';

bot.on('ready', async() => {
    console.log('READY');
    bot.editStatus('online', {
        name: `${prefix}help | ${status}`,
    });
    console.log('SET - STATUS');
    const tkn = await genNucleusToken();
    if (tkn !== true) {
        console.log('Error generating Nucleus token! Exiting process...');
        process.exit();
    }
} );

bot.connect();

setInterval(async() => {
    const token = await genNucleusToken();
    if (token !== true) {
        console.log('Error regenerating Nucleus\'s token!');
    }
}, 1800000);