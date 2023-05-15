const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({   
    message:{
        type: String,
       
    },
    reporter_email:{
        type: String,
    },
    reportee_email:{
        type: String,
    },
    homeid:{
        type: String,
    }
},{timestamps: true});


  
    //creating user module and exporting
    const Report = mongoose.model('Report', reportSchema);
    module.exports = Report;
