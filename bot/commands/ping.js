const sendMessage = require('../functions/sendMessage');

function ping(time) {
    const actTime = `${new Date - time}`;

    if (Number(actTime) > 180000) {
        return `\`Over 3 minutes (${actTime}\`ms\`)\``;
    }
    return `\`${actTime}\`ms`;
}

module.exports = () => ({
    label: 'ping',
    execute: async(msg) => {
        const date = new Date();
        const mess = await sendMessage(msg.channel, 'Pong!');
        if (!mess) {
            return null;
        }

        mess.edit(`Pong! ${ping(date)}`);
    },
    options: {
        description: 'Ping the bot',
        usage: 'ping',
    }
})