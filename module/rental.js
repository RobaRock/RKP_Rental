const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
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
    location:{
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
    uid: {
        type: String,
        require: true
    },
    Rented:{
        type: String,
        default: 'false'
    },
    lat:{
        type: String
    },
    lng:{
        type: String
    },
    type:{
        type: String,
    },
    vedio:{
        type: String
    }
},{timestamps: true});

const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental;