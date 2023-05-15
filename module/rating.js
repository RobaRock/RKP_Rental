const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    home_id: {
        type: String,
    },
   
    rating_number:{
        type: String, 
    },
    user_id:{
        type: String,
    }
    
},{timestamps: true});


  
    //creating user module and exporting
    const Rating = mongoose.model('Rating', ratingSchema);


    module.exports = Rating;