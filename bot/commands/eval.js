const util = require('util');

const inspect = util.inspect;

const sendMessage = require('../functions/sendMessage');
const config = require('../../config');
const User = require('../../models/user');
const Image = require('../../models/image');

module.exports = bot => ({
    label: 'eval',
    execute: async (msg, args) => {
        if (!config || !config.owners || !config.owners.includes(msg.author.id)) {
            return sendMessage(msg.channel, 'Error 501. Unauthorized');
        }
        const member = msg.member;
        const guild = msg.channel.guild;
        const channel = msg.channel;

        let evaled;
        try {
            evaled = await eval(args.join(' '));

            if (typeof evaled === 'object') {
                evaled = inspect(evaled, { depth: 0, showHidden: true });
            } else {
                evaled = String(evaled);
            }
        } catch (err) {
            return sendMessage(msg.channel, err.message ? err.message : err.name);
        }

        /** Just for security. */
        evaled = evaled.replace(bot.token, 'No no');

        const fullLen = evaled.length;

        if (fullLen === 0) {
            return;
        }

        if (fullLen > 2000) {
            evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || [];
            if (evaled.length > 3) {
                sendMessage(msg.channel, `Cut the response! [${evaled.length} | ${fullLen}]`);
                sendMessage(msg.channel, `\`\`\`js\n${evaled[0]}\`\`\``);
                sendMessage(msg.channel, `\`\`\`js\n${evaled[1]}\`\`\``);
                sendMessage(msg.channel, `\`\`\`js\n${evaled[2]}\`\`\``);
                return;
            } else {
                return evaled.forEach((message) => {
                    sendMessage(msg.channel, `\`\`\`js\n${message}\`\`\``);
                    return;
                });
            }
        }
        return sendMessage(msg.channel, `\`\`\`js\n${evaled}\`\`\``);
    },
    options: {
        description: 'Eval JavaScript',
        usage: 'eval [code]',
        limitedto: 'Null'
    }
})