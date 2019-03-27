const sendMessage = require('./sendMessage');
const bot = require('../bot');
const util = require('util');
const sleep = util.promisify(setTimeout)

async function del(mess) {
    await sleep(5000);
    mess.delete();
}


/**
 * Checks if a user is authorized (in Axon internal guild).
 * 
 * @param {Object} msg The message object to act upon
 * 
 * @param {String} id The ID to check if they are authorized (in Axon internal guild).
 * 
 * @param {Boolean} [sendMess] Whether or not to send a message throughout the process.
 */
async function botAuthorize(msg, id, sendMess) {
    if (!sendMess) {
        sendMess = false;
    }
    let mess;
    let message;
    if (sendMess !== false) {
        mess = await sendMessage(msg.channel, 'Authorizing...');
        if (!mess) {
            return false;
        }
        message = {
            content: '',
            embed: {
                title: 'Authentication failed',
                description: 'I am not in the guild required! Authentication aborted!'
            }
        };
    }
    const basicMessage = 'Unauthorized!';

    const guild = bot.guilds.find(g => g.id === '412348024526995457');
    if (!guild) {
        if (sendMess !== false) {
            await mess.edit(message);
        }
        return false;
    }
    const mem = guild.members.get(id);
    if (!mem) {
        if (sendMess !== false) {
            await mess.edit(basicMessage);
        }
        return false;
    }
    if (sendMess !== false) {
        mess.edit('Authorized!');
        del(mess);
    }
    return true;
}

module.exports = botAuthorize;