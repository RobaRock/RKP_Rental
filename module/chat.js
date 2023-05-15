const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    seller_name: {
        type: String,
    },
   
    home:{
        type: String,
       
    },
    main_message:{
        type: String,
    },
    
    self_uid:{
        type: String,
    },
    seller_uid:{
        type: String,
    },
    
},{timestamps: true});


  
    //creating user module and exporting
    const Chat = mongoose.model('Chat', chatSchema);


    module.exports = Chat;