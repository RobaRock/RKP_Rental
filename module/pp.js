const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    phonenumber:{
        type: Number,
        require: true
    },
    email:{
        type: String,
        unique: true,
        require: true
    },
    profilepicture:{
        type: String,
        require: true
    },
});
const Profile = mongoose.model('profile', profileSchema);
module.exports = Profile;