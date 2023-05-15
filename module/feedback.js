const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    name: {
        type: String,
    },
   
    message:{
        type: String,
       
    },
    email:{
        type: String,
    }
},{timestamps: true});


  
    //creating user module and exporting
    const Feedback = mongoose.model('Feedback', feedbackSchema);
    module.exports = Feedback;