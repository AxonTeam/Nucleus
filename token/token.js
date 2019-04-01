const hashToken = require('./hash');
const UserModel = require('../models/user');
const Crypto = require('crypto');

function tokenize(token) {
    const userID = Buffer.from(token).toString('base64');
    const date = Buffer.from(new Date().getUTCMilliseconds().toString()).toString('base64');
    const tokenn = Crypto.randomBytes(48).toString('base64').replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    const endToken = `${userID}.${date}.${tokenn}`;
    return endToken;
}

async function generator(userID) {
    let uID = userID;
    if (userID === 'root') {
        userID = Crypto.randomBytes(256).toString('base64').replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        uID = 'root';
    }
    const token = tokenize(userID);
    const endToken = await hashToken(token);
    const user = new UserModel( { ID: uID, token: endToken } );
    await user.save();
    return token;
}
  
module.exports = generator;