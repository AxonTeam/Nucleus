const { owners } = require('../../config.json')
const { promisify } = require('util')
const { exec } = require('child_process')
const aExec = promisify(exec)
const sendMessage = require('../functions/sendMessage')

async function execute(command) {
    let execution
    try {
        execution = await aExec(command)
    } catch (err) {
        return `An error has occurred! See below\n\`\`\`js\n${err.message ? err.message : err}\`\`\``
    }
    return `\`\`\`sh\n${execution.stdout}\`\`\``
}

module.exports = () => ({
    label: 'exec',
    execute: async(msg, args) => {
        if (!owners.includes(msg.author.id)) {
            return;
        }
        if (!args[0]) {
            return sendMessage(msg.channel, 'Invalid usage, Supply a command to execute!')
        }
        const message = await sendMessage(msg.channel, `Running command \`${args.join(' ')}\``)
        const exc = await execute(args.join(' '))
        message.edit(`Output for \`${args.join(' ')}\``)
        if (exec.length > 2000) {
            let out = exc.substring(0, 1994)
            out = `${out}\`\`\``
            return sendMessage(msg.channel, out)
        }
        sendMessage(msg.channel, exc)
    },
    options: {
        description: 'Execute a terminal command',
        usage: 'exec [command]',
        example: 'exec git status',
        aliases: ['execute'],
        limitedto: 'Bot Owners'
    }
})
