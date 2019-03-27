const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel =  new Schema({
    ID: { type: String, required: true },

    token: { type: String }
})

module.exports = mongoose.model('user', userModel);