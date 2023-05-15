const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savedhomeSchema = new Schema({
    id:{
        type: String,
        require: true
    },
    name:{
        type: String,
        require: true
    },
    phonenumber:{
        type: Number,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    bedroom:{
        type: Number,
        require: true
    },
    bathroom:{
        type: Number,
        require: true
    },
    locationsaved:{
        type: String,
        require: true
    },
    sqrt:{
        type: Number,
        require: true
    },
    additionalfeature:{
        type: String,
        require: true
    },
    uid:{
        type: String,
        require: true
    },
    pic1: {
        type: String,
        require: true
    },
    pic2: {
        type: String,
        require: true
    },
    pic3: {
        type: String,
        require: true
    },
    pic4: {
        type: String,
        require: true
    },
  
},{timestamps: true});

const Savedhome = mongoose.model('Savedhome', savedhomeSchema);
module.exports = Savedhome;