/* --- FUNCTIONS --- */

const hasRoot = require('../functions/hasRootChecker');
const isID = require('../functions/isValidID');
const auth = require('../functions/authorize');
const sendMessage = require('../functions/sendMessage');
const purge = require('../functions/purgeDB');
/* --- DATABASE/MODELS --- */

const UserModel = require('../../models/user');

module.exports = () => ({
    label: 'haveToken',
    execute: async (msg, args) => {
        if (args[0]) {
            if (!hasRoot(msg.author.id) ) {
                return await sendMessage(msg.channel, 'Error 501: Unauthorized');
            }
            if (!isID(args[0]) ) {
                return await sendMessage(msg.channel, 'Invalid ID');
            }
            const user = await UserModel.findOne({ ID: args[0] }).exec();
            const authBol = await auth(msg, args[0], false);
            if (!user) {
                if (authBol) {
                    return await sendMessage(msg.channel, `They do not have a token, but they can make one!`);
                }
                return await sendMessage(msg.channel, `They do not have a token!`);
            }
            if (!authBol) {
                return await sendMessage(msg.channel, `They have a token, but is not authenticated! You can remove their token by doing \`${msg.prefix}token purge ${args[0]}\` or it will be removed when they next check if they have a token!`);
            }
            return await sendMessage(msg.channel, `They have a token!`);
        }
        const user = await UserModel.findOne( { ID: msg.author.id } ).exec();
        const authBol = await auth(msg, msg.author.id, false);
        if (!user) {
            if (!authBol) {
                return sendMessage(msg.channel, 'You do not have a token!');
            }
            return sendMessage(msg.channel, 'You do not have a token, but you can get one!');
        }
        if (!authBol) {
            await purge(msg.channel, msg, true, msg.author.id);
            return sendMessage(msg.channel, 'You do not have a token!');
        }
        return sendMessage(msg.channel, 'You have a token!');
    },
    options: {
        description: 'Checks if you (or another user (Root only)) has a token.',
    }
})