const UserModel = require('../../models/user');
const sendMessage = require('./sendMessage');

async function purge(channel, msg, noMsg, id) {
    const actID = id || msg.author.id;
    const user = await UserModel.findOne( { ID: actID } ).exec();
    if (!user) {
        throw Error('Manage DB - PurgeDB - User not found!');
    }
    const del = await UserModel.deleteMany( { ID: actID } );
    /* Handles message the channel */
    if (!noMsg) {
        if (del && del.ok === 1) {
            return sendMessage(channel, 'Purged the database of your ID!');
        }
        return sendMessage(channel, 'There was a error purging the database');
    }
    if (del && del.ok === 1) {
        return true;
    }
    return false;
}

module.exports = purge;