/* --- IMPORTANT/USED FILES --- */
const hasRoot = require('../functions/hasRootChecker');
const isID = require('../functions/isValidID');
const sendMessage = require('../functions/sendMessage');
const authorize = require('../functions/authorize');
const token = require('../../token/token');
const purge = require('../functions/purgeDB');
const UserModel = require('../../models/user');

async function genCommand(channel, msg, noembed) {
    const user = await UserModel.findOne( { ID: msg.author.id } ).exec();
    if (user) {
        try {
            await purge(msg.channel, msg, true);
        } catch (err) {
            if (err === 'Manage DB - PurgeDB - User not found!') {
                return;
            }
        }
    }
    const tokn = await token(msg.author.id);
    return await sendToken(channel, msg, noembed, tokn);
}

async function sendToken(channel, msg, noembed, tokn) {
    let mess = {
        embed: {
            title: 'TOKEN',
            fields: [
                {
                    name: 'User',
                    value: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`
                },
                {
                    name: 'Token',
                    value: tokn,
                }
            ]
        }
    }
    if (noembed !== false) {
        mess = `${tokn}`;
    }
    sendMessage(channel, mess);
}

async function purgeCommand(msg, args) {
    if (args[1]) {
        if (isID(args[1]) === false) {
            return sendMessage(msg.channel, 'Invalid ID!');
        }
        const mess = await sendMessage(msg.channel, 'Checking authentication...');
        const has = hasRoot(msg.author.id);
        if (has !== true) {
            return mess.edit('Unauthorized!');
        }
        mess.edit('Authorized!'); /* 'Manage DB - PurgeDB - User not found!' */
        let p;
        try {
            p = await purge(msg.channel, msg, true, args[1]);
        } catch (err) {
            if (err.message === 'Manage DB - PurgeDB - User not found!' || err === 'Manage DB - PurgeDB - User not found!') {
                return sendMessage(msg.channel, 'User not found in database! Cannot purge!');
            }
        }
        const message = (p === true ? `Purged the database of ID ${args[1]}` : 'Unable to purge the database!');
        return await mess.edit(message);
    }
    return null;
}

module.exports = bot => ({
    label: 'token',
    execute: async(msg, args) => {
        let noembed = false;
        const auth = await authorize(msg, msg.author.id, true);
        if (auth === false) {
            const user = await UserModel.findOne( { ID: msg.author.id } ).exec();
            if (user) {
                try {
                    await purge(msg.channel, msg, true);
                } catch (err) {
                    if (err === 'Manage DB - PurgeDB - User not found!') {
                        return;
                    }
                }
            }
            return null;
        }
        if (args.join(' ').includes('--no-embed')) { // Check for the no-embed flag
            noembed = true; // Set noembed to true
        }
        args = args.join(' ').toLowerCase().replace(/--no-embed/, '').split(' '); // remove the no-embed flag
        if (args[0] === 'purge') {
            return await purgeCommand(msg, args);
        }
        const channel = await bot.getDMChannel(msg.author.id);
        return await genCommand(channel, msg, noembed);
    },
    options: {
        flags: [
            {
                flag: 'no-embed',
                description: 'Sends your token to you without the embed'
            }
        ],
        subcommands: [
            {
                label: 'purge',
                description: 'Purges you from the database'
            }
        ],
        description: 'View or manage your private token',
        limitedto: 'AxonTeam members only',
        usage: 'token (flag)',
    }
});
