function isValidID(id) {
    if (isNaN(Number(id))) {
        return false;
    }
    if (id.length < 16 || id.length > 20) {
        return false;
    }
    return true;
}

module.exports = isValidID;