const token = require('./token');
const UserModel = require('../models/user');

const initConnection = require('./initConnection');

(async function genToken() {
    await initConnection(false);
    console.log('Starting root token generation...');
    const user = await UserModel.find({ ID: 'root' }).exec();
    if (user) {
        const ended = await UserModel.deleteMany({ ID: 'root' });
        if (ended.length > 0 || ended.n > 0) {
            console.log('Purged ROOT user (necessary)');
        }
    }
    const tkn = await token('root');
    if (!tkn) {
        console.log('ABORTED - Something went wrong with creating the root token!');
        procces.exit();
    }
    const fToken = tkn.token;
    console.log('SUCCESS - The root token is below, keep this safe!');
    console.log(fToken);
    process.exit();
})();