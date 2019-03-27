const bcrypt = require('bcrypt');

const createHash = async (token) => {
  const hash = await bcrypt.hash(token, 10);
  return hash;
};

module.exports = createHash;