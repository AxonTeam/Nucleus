const UserModel = require('../../models/user');

async function purge(id) {
    const actID = id;
    const user = await UserModel.findOne( { ID: actID } ).exec();
    if (!user) {
        return false;
    }
    const del = await UserModel.deleteMany( { ID: actID } );
    /* Handles message the channel */
    if (del && del.ok === 1) {
        return true;
    }
    return false;
}

module.exports = purge;