const mongoose = require('mongoose')

/**
 * Initalizes a mongoose connection to the database
 */
async function initConnection() {
    await mongoose.connect('mongodb://localhost/AxonTeam', {
        useCreateIndex: true,
        autoReconnect: true,
        useNewUrlParser: true
    });
}

module.exports = initConnection;