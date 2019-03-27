const util = require('util');
const sleep = util.promisify(setTimeout);
const sendMessage = require('../functions/sendMessage');

module.exports = bot => ({
    label: 'help',
    execute: async (msg, args) => {
      if (!args[0]) {
          const fields = []
          for (let command in bot.commands) {
                command = bot.commands[command];
                const field = { name: `${msg.prefix}${command.label}`, value: command.description };
                fields.push(field);
          }
          const channel = await bot.getDMChannel(msg.author.id);
          const mess = await sendMessage(msg.channel, 'Check your DMs!');
          await sleep(5000);
          mess.delete();
          msg.delete().catch(() => {
              // Ignore this error
          })
          const message = {
              embed: { title: 'help', fields }
          };
          return await sendMessage(channel, message);
      }
      if (!bot.commands[args[0].toLowerCase()]) {
          return sendMessage(msg.channel, `Command not found! Use \`${msg.prefix}help\` to see a list of commands!`);
      }
      const command = bot.commands[args[0].toLowerCase()];
      console.log(command);
      let fields = [];
      const mess = {
          title: `Help for ${msg.prefix}${command.label}`,
          description: `**Name:** ${command.label}`
      }
      if (command.description) {
          mess.description += `\n**Description:** ${command.description}`;
      }
      if (command.usage) {
          mess.description += `\n**Usage:** \`${msg.prefix}${command.usage}\``;
      }
      if (command.options.limitedto) {
          mess.description += `\n**Limited to:** ${command.options.limitedto}`
      }
      if (command.options.flags.length > 0) {
          let finale = { name: 'Flags', value: [] };
          for (let flag of command.options.flags) {
              const cur = `\`--${flag.flag}\` - ${flag.description}`;
              finale.value.push(cur);
          }
          finale.value = finale.value.join('\n');
          fields.push(finale);
      }
      if (command.options.subcommands.length > 0) {
          let finale = { name: 'Subcommands', value: [] };
          for (let subcmd of command.options.subcommands) {
              const cur = `\`${msg.prefix}${command.label} ${subcmd.label}\` - ${subcmd.description}`;
              finale.value.push(cur);
          }
          finale.value = finale.value.join('\n');
          fields.push(finale);
      }
      if (fields.length > 0) {
          mess.fields = fields;
      }
      return sendMessage(msg.channel, {
          embed: mess
      });
    },
    options: {
      description: 'This help text',
      usage: 'help (command)'
    }
})