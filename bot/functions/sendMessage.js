const bot = require('../bot');

const regErr = /RESTError |HTTPError /g;
const numReg = /[0-9]{5}/

async function sendHandledMess(channel, content) {
    try {
        return await bot.createMessage(channel.id, content);
    } catch (err) { // Some error handling
        const type = err.message.match(regErr); // Type of error (HTTP or REST)
        const iNum = /5[0-9]{2}/; // Internal server error id regex
        const endNum = err.message.match(iNum); // Internal server error id
        if (err.message === `Discord${type}Error: ${endNum} INTERNAL SERVER ERROR on POST /api/v7/channels/${channel.id}/messages`) {
            throw Error('sendMessage - Discord - Internal discord error when sending emoji');
        } else if (err.message.startsWith('Request timed out') && err.message.match(/messages/) ) {
            throw Error('sendMessage - Discord - Request timed out!');
        } else if (err.message === `Discord${type}Error [10003]: Unknown Channel`) {
            throw Error('sendMessage - Discord - Invalid channel (Non exist)');
        } else if (err.message.startsWith(`Discord${type}Error [50035]:`) && err.message.match(`channel_id: Value "${channel.id}" is not snowflake.`) ) {
            throw Error('sendMessage - Discord - Channel id is not snowflake!');
        } else {
            throw err;
        }
    }
}

async function dmSend(channel, content) {
    try {
        return await bot.createMessage(channel.id, content);
    } catch (err) {
        if (regErr.test(err.message)) {
            const errNum = err.message.match(numReg) ? err.message.match(numReg)[0] : null;
            if (errNum === '50007') {
                throw Error('sendMessage - Unable to DM user!')
            } else {
                const type = err.message.match(regErr); // Type of error (HTTP or REST)
                const iNum = /5[0-9]{2}/; // Internal server error id regex
                const endNum = err.message.match(iNum); // Internal server error id
                if (err.message === `Discord${type}Error: ${endNum} INTERNAL SERVER ERROR on POST /api/v7/channels/${channel.id}/messages`) {
                    throw Error('sendMessage - Discord - Internal discord error when sending emoji');
                } else if (err.message.startsWith('Request timed out') && err.message.match(/messages/) ) {
                    throw Error('sendMessage - Discord - Request timed out!');
                } else if (err.message === `Discord${type}Error [10003]: Unknown Channel`) {
                    throw Error('sendMessage - Discord - Invalid channel (Non exist)');
                } else if (err.message.startsWith(`Discord${type}Error [50035]:`) && err.message.match(`channel_id: Value "${channel.id}" is not snowflake.`) ) {
                    throw Error('sendMessage - Discord - Channel id is not snowflake!');
                } else {
                    throw err;
                }
            }
        } else {
            throw Error(`sendMessage - Something unknown happened. - ${err}`);
        }
    }
}

/**
 * Send a error handled message (returns errors or promise)
 * 
 * @param {Object} client The eris client
 * 
 * @param {Object} The channel object
 * 
 * @param {Object|String} content The content to send.
 */
async function sendMessage(channel, content) {
    if (!channel || typeof channel !== 'object') {
        throw Error('sendMessage - Channel nneeds to be defined and a object!');
    }
    if (channel.type === 1) {
        const msg = await dmSend(channel, content);
        return msg;
    }
    if (channel.guild) {
        const botmem = channel.guild.members.get(bot.id);
        if (!botmem) {
            return await sendHandledMess(channel, content);
        }
        if (!botmem.permissions.contains('sendMessages')) {
            throw Error('sendMessage - Permissions - No permissions to send message!');
        }
        return await sendHandledMess(channel, content);
    }
    throw Error('sendMessage - Not allowed - Messages only allowed to be sent in guilds and DMs!');
}

module.exports = sendMessage;