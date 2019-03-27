const config = require('../../config.json');

/**
 * Checks if the user has root (on bot)
 * 
 * @param {String} userID The user id to check for root for
 */
function hasRootChecker(userID) {
    if (!config || !config.hasRoot) { // If no config, or config does not have root
        return false;
    }
    let hasRoot = config.hasRoot;
    /* --- Checks if hasRoot is valid! --- */
    if (typeof hasRoot === 'string' && !Array.isArray(hasRoot)) {
        throw Error('BOT COMMAND TOKEN (hasRootChecker) - config.hasRoot must be string or array!'); /* --- Checks if user has root! --- */
    } else if (typeof hasRoot === 'string') {
        const bol = hasRoot === userID;
        return bol;
    } else if (hasRoot.includes(userID)) {
        return true;
    }
}

module.exports = hasRootChecker;