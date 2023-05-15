const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    uid:{
        type: String,
        require: true
    },
    language:{
        type: String,
        require: true
    }
},{timestamps: true});

const Language = mongoose.model('Language', languageSchema);
module.exports = Language;