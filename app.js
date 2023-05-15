const _ = require('lodash');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authroute = require('./routes/authroutes');
const mainroutes = require('./routes/mainroutes');
const { checkUser } = require('./middleware/authMiddleware');
const cors = require("cors"); 

const app = express();
    // connect to mangodb
const dburi = 'mongodb+srv://robel:robelasfaww918@cluster0.h19hdv4.mongodb.net/node-project?retryWrites=true&w=majority'    
mongoose.connect(dburi)
.then((result)=> 
app.listen(3000)
)
.catch((err)=>{
    console.log(err);
})

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/constant/'));
app.use(express.static(__dirname+'/assets/'));

app.use(express.json());
app.use(cors()); 
app.use(express.urlencoded({limit: '50mb',extended:true}));



app.use(cookieParser());
app.use('*', checkUser);
 
  
app.use(authroute,(req,res,next)=>{
    next('route');
});

app.use(mainroutes);
