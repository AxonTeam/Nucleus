const mongoose = require('mongoose');

const { Schema } = mongoose

const imageModel = new Schema({
    ID: { type: String, required: true }, // Image ID
    type: { type: String, required: true },

    uploaderID: { type: String, required: true }, // Uploader ID
    link: { type: Buffer, required: true },
    ext: { type: String, default: 'png' }
});

module.exports = mongoose.model('image', imageModel);
