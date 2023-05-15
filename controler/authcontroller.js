const User = require('../module/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const MongoClient = require('mongodb').MongoClient;
const twilio = require('twilio')
const axios = require('axios');
const { use } = require('../routes/authroutes');

  //handle loginerror
  const loginhandleErrors = (err) =>{

    // console.log(err.message, err.code);
    let errors = { email: '', password: ''};

    //email not verified
    if(err.message === 'Email Not Confirmed'){
      errors.email = 'Email is Not confirmed';
    }

    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
    // blocked user
    if(err.message === 'blocked account'){
      errors.email = 'The Account is blocked';
    }

  // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
      return errors;
  }

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { name:'', phonenumber: '',email: '', password: '', confirm:''};
  
    // duplicate email error
    if (err.code === 11000) {
      if(err.keyValue.hasOwnProperty('phonenumber')){
        errors.phonenumber = 'that phonenumber is already registered';
      }
      if(err.keyValue.hasOwnProperty('email')){
        errors.email = 'that email is already registered';
      } 
      return errors;
    }

   
    // validation errors
    if (err.message.includes('User validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }
  // create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

module.exports.post_sign_up = async(req,res)=>{
    
    // if(!(req.body.hasOwnProperty("landlord"))){
    //     req.body.landlord = false;
    //     const landlord = req.body.landlord;
    // }
    console.log(req.body);
    const userform = req.body;
    userform.profilepicture = '';
    // console.log(req.body.confirm);
    // console.log(name,phonenumber,email,password,landlord);
    // res.send('new sign up');
  
    try {
      const user = await User.create(userform);
      const token = createToken(user._id);
      res.cookie('jwt', token, {  maxAge: maxAge * 1000 });
      res.status(201).json({user: user.id});
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
}

module.exports.put_upload = (req,res) =>{
    const isfirst = false;
    const id = req.params.id;
    console.log(id);

   User.findOne(
     { _id:id},
     function (err,foundObject){
      console.log(req.body);
        if(err){
            console.log(err);
            res.status(500).send();
        }
        else {
            if(!foundObject){
                res.status(404).send();
            }
            else{
                foundObject.name = req.body.name;
                foundObject.phonenumber = req.body.phonenumber;
                foundObject.email = req.body.email;
                if(req.file){
                  foundObject.profilepicture = req.file.filename;
                }    
                  User.findById(id)
                .then((result) =>{
                  foundObject.password =  result.password;
                  console.log(foundObject.password);
                })
                .catch(e =>{
                  console.log(e);
                 });
                 console.log(foundObject);
                 foundObject.save()
                .then((result) =>{
              
                    res.redirect('/');
                    console.log("successful");
                })
                .catch(e =>{
                    console.log(e);
                })
                
            }
        }
    }
   )
}


  module.exports.post_log_in = async(req,res)=>{
    const { email, password } = req.body;
var status;
try {
  const user = await User.log_in(email,password);
  if(!(user.id === '')) {
    if(!(user.userPhoto === '')){
      User.findById(user.id)
      .then((result) =>{
        // const token = createToken(user._id);
        // res.cookie('jwt', token, { maxAge: maxAge * 1000 });
        
        axios.post('http://127.0.0.1:5000/comapre_user_photoes', {
          userPhoto: result.userPhoto
        })
        .then(response => {
          status = response.data.status;
          if(status === 'true'){
            const token = createToken(user._id);
            res.cookie('jwt', token, { maxAge: maxAge * 1000 });
            res.status(201).json({user: user.id});
          }
          else{
            res.status(400).json({status: status});
          }
        })
        .catch(error => {
          console.log(error)     // handle error
        });
      })
      .catch((e) => console.log(e));
    }
    else{
         try{
        const user = await User.log_in(email,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {  maxAge: maxAge * 1000 });
      res.status(201).json({user: user.id});
    }
    catch(err){
      const errors = loginhandleErrors(err);
      res.status(400).json({errors});
    }
    }
   
  }      
}
catch(err){
  const errors = loginhandleErrors(err);
  res.status(400).json({errors});
}

  //       const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

  // const userPhoto =  Date.now() + randomNumber+'.jpg';

  // await axios.post('http://127.0.0.1:5000/save_user_photoes',{
  //   userPhoto: userPhoto
  // })
  // .then(response => {

  // })
  // .catch(error => {
    
  //     // handle error
  // });

     



    //   const { email, password } = req.body;
    //   try{
    //     const user = await User.log_in(email,password);
    //     const token = createToken(user._id);
    //     res.cookie('jwt', token, {  maxAge: maxAge * 1000 });
    //   res.status(201).json({user: user.id});
    // }
    // catch(err){
    //   const errors = loginhandleErrors(err);
    //   res.status(400).json({errors});
    // }
  }

  module.exports.get_log_out = (req,res)=>{
      console.log("log out Sucessful")
      res.cookie('jwt','',{maxAge:1});
      res.redirect('/');
  }

// try {
  //   const user = await User.create(userform);
  //   const token = createToken(user._id);
  //   res.cookie('jwt', token, {  maxAge: maxAge * 1000 });
  //   res.status(201).json({user: user.id});
  // }
  // catch(err) {
  //   const errors = handleErrors(err);
  //   res.status(400).json({ errors });
  // }
  
    // Email confirmation route
  module.exports.get_confirm_email = async(req,res) =>{
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.isEmailConfirmed) {
      return res.send('Email already confirmed');
    }
    try{
      user.isEmailConfirmed = true;
      await user.save();
      const token = createToken(user._id);
      res.cookie('jwt', token, {  maxAge: maxAge * 1000 });
      res.send('Email Confirmed Successfully');

    }
      catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
      }
   
  }

  module.exports.get_confirm_phone = async (req,res) =>{
      const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.isPhoneConfirmed) {
      return res.send('Phone already confirmed');
    }
    user.isPhoneConfirmed = true;
    await user.save();
    res.send('Phone confirmed');
  }

  

    // Register user route
module.exports.post_register = async(req,res)=>{
  console.log(req.body)
  const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

  const userPhoto =  Date.now() + randomNumber+'.jpg';

  await axios.post('http://127.0.0.1:5000/save_user_photoes',{
    userPhoto: userPhoto
  })
  .then(response => {

  })
  .catch(error => {
    
      // handle error
  });

  console.log(userPhoto);
  req.body.userPhoto = userPhoto;
  console.log(req.body)






  const user = new User(req.body);
  try{
    await user.save();
   res.status(201).json({user: user.id, isEmailConfirmed: user.isEmailConfirmed});
    
  // Send email confirmation
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'robelbethelhem@gmail.com',
      pass: 'zharbowsydpvlcfb',
    },
  });
  const mailOptions = {
    from: 'robelbethelhem@gmail.com',
    to: req.body.email,
    subject: 'Confirm your email',
    text: `Please click the following link to confirm your email:    http://localhost:3000/confirm-email/${user._id}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  }catch(err){
    errors = handleErrors(err);
    res.status(400).json({ errors });
  }

  

  // Send phone confirmation
  // const client = twilio(
  //   'AC37f008ede0527b11e015a5d66b7d90c0',
  //   'ddf723eedbf75f11c80554b1405b6c28'
  // );
  // client.messages
  // .create({
  //   body: `Please click the following link to confirm your phone number: http://localhost:3000/confirm-phone/${user._id}`,
  //   // from: '+14407606591', // Your Twilio phone number
  //   messagingServiceSid: 'MG6173db1bae08034c5a38eccf4d5407cd',
  //   to: req.body.phonenumber,
  // })
  // .then(message => {
  //   console.log(message.sid);
  //   res.send('User registered');
  // });

}