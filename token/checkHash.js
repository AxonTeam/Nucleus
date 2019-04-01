const bcrypt = require('bcrypt');
const userModel = require('../models/user');

/**
 * Check the hash
 *
 * @param {String} userID The inputted userID
 * 
 * @param {String} token The inputted token
 *
 * @returns Boolean
 */
const checkHash = async(userID, token) => {
    const user = await userModel.findOne( { ID: userID } ).exec();
    if (!user) {
        return false;
    }
    const hash = user.token;
    const check = bcrypt.compareSync(token, hash);
    return check;
};

module.exports = checkHash;