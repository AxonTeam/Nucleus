const userModel = require('../models/user');
const util = require('util');
const sleep = util.promisify(setTimeout);
const initConnection = require('./initConnection');

(async function fetchRoot() {
    await initConnection(false);
    const root = await userModel.findOne({ ID: 'root' }).exec();
    if (!root) {
        console.log('ABORTED - No root user found!');
        await sleep(200);
        process.exit();
    }
    const token = root.token;
    console.log('SUCCESS - See the token below:');
    console.log(token);
    process.exit();
})();