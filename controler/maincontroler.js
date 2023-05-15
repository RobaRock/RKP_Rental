const Rating = require('../module/rating');
const Feedback = require('../module/feedback')
const Rental = require('../module/rental');
const Savedhome = require('../module/saved_home');
const Profile = require('../module/pp');
const User = require('../module/user');
const Report = require('../module/report')
const Language = require('../module/language');
const mongoose = require('mongoose');
const Chat = require('../module/chat');
const jwt = require('jsonwebtoken');
const path = require('path');
const { result, forEach, remove, isEmpty } = require('lodash');
const { use } = require('../routes/mainroutes');
const http = require('http');
const fs = require('fs');
const axios = require('axios');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var paypal = require('paypal-rest-sdk');
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
  }
  
  const stripesecretkey = process.env.STRIPE_SECRET_KEY
  const stripepublickey = process.env.STRIPE_PUBLIC_KEY
  const Stripe = require('stripe');
const { response } = require('express');
  const stripe = Stripe(stripesecretkey);

  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ASN1EK7Ix8z6bguwDWHnL1gKWZZC8Uj8wTn8-vDfu7mfzxsUS7tUh8ddbB_gXAY8Nx4O0_qINKUxH-Zl',
    'client_secret': 'EJ0BrcL2QMqqiqI8_SBx4XtD6s_LwYvsq5F22suGEfchnIbnqQ8clp10-Ek7paOFk_qL0mpZMkxiBH1H'
  });

  module.exports.get_confirm_forgot_password = async (req,res) =>{
    console.log(req.params.id)
    var newpass = '12345'
    const salt = await bcrypt.genSalt();
    newpasshash = await bcrypt.hash(newpass, salt);

    // Rating.findByIdAndUpdate(ratings[i].id, {rating_number: average_rating, user_id:updated_user_id_who_rated},{new:true}, function(err, docs){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log("Updated Document: ", docs);
    //         res.redirect('/available_homes');
    //     }
    // });

    User.findByIdAndUpdate(req.params.id, {password: newpasshash, confirm: newpass},{new:true},function(err, docs){
        if(err){
            console.log(err);
        }
        else{
            console.log("Updated Document: ", docs);
            res.send('your OTP password 12345 you can login and can change your password');
        }
    });
  }

  module.exports.post_forgot_password = (req,res) =>{
    const reset_email = req.body.email;
    User.findOne({email: reset_email}, (err,user)=>{
        if(user){
            if (err) throw console.log(err);
            res.status(201).json({user: user.id});
            
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
    subject: 'Confirm your reset password',
    text: `Please copy the following link and browse in internet exprorer to confirm your reset password: http://localhost:3000/confirm_forgot_password/${user._id}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })

        }
        else{
            res.status(400).json({error: 'email is incorrect'});
        }
    })
  }
 


  module.exports.get_forgot_password = (req,res) =>{
    res.render("forgot_password",{title:'forgot_password', naveprofile:'', displayer: 0})
  }

  module.exports.get_voice_assistance = (req,res) =>{
    res.render("voice_assistance",{title:'voice_assistance', naveprofile:'', displayer: 0})
  }

  module.exports.post_rkp_dialoger = (req,res) =>{
    console.log('I am in right way')
    var postData = {};
    axios.post('http://127.0.0.1:5000/voice_assistace')
    .then(response => {
        postData.type = response.data.type,
        postData.price_min = response.data.price_min,
        postData.price_max = response.data.price_max,
        postData.location = response.data.location,
        postData.bedroom_min = response.data.bedroom_min,
        postData.bedroom_max = response.data.bedroom_max,
        postData.bathroom_min = response.data.bathroom_min,
        postData.bathroom_max = response.data.bathroom_max
        console.log(postData);
        // redirect to filter_index page with postData as query parameters
        res.redirect(`/filter_index?type=${postData.type}&price_min=${postData.price_min}&price_max=${postData.price_max}&location=${postData.location}&bedroom_min=${postData.bedroom_min}&bedroom_max=${postData.bedroom_max}&bathroom_min=${postData.bathroom_min}&bathroom_max=${postData.bathroom_max}`);
    })
    .catch(error => {
        console.error(error);
        // handle error
    });
      
  }


  module.exports.post_rkp_estimator = (req,res) =>{
    console.log(req.body)
    axios.post('http://127.0.0.1:5000/predict_home_price', {
        location: req.body.location,
        sqft: req.body.sqft,
        bhk: req.body.bhk,
        bath: req.body.bath
      })
      .then(response => {
        res.status(200).json(response.data)
        // console.log(response.data.estimated_price);
      })
      .catch(error => {
        // console.error(error);
        res.status(400).json({error});
      });
  }

  module.exports.post_check_photoes = (req,res) =>{
    const rental = new Rental(req.body);
    const sourceFolderPath  = 'C:/webproject/assets/checkphoto';
    const destFolderPath  = 'C:/webproject/assets/homes';
    rental.pic1 = req.files.pic1[0].filename;
    rental.pic2 = req.files.pic2[0].filename;
    rental.pic3 = req.files.pic3[0].filename;
    rental.pic4 = req.files.pic4[0].filename;
    if(req.files.vedio){
        rental.vedio = req.files.vedio[0].filename;
    }
    else{
        rental.vedio = ""
    }
    let path1 ="C:/webproject/assets/checkphoto/" + rental.pic1
    let path2 ="C:/webproject/assets/checkphoto/" + rental.pic2
    let path3 ="C:/webproject/assets/checkphoto/" + rental.pic3
    let path4 ="C:/webproject/assets/checkphoto/" + rental.pic4
    let video ="C:/webproject/assets/checkphoto/" + rental.vedio
    console.log(path)

    axios.post('http://127.0.0.1:5000/check_photoes', {
        pic1: path1,
        pic2: path2,
        pic3: path3,
        pic4: path4,
        video: video
      })
      .then(response => {
        res.status(200).json(response.data)
        console.log("response.data")
        console.log("response.data")
        console.log("response.data")
        console.log("response.data")
        console.log("response.data")
        console.log(response.data)
        console.log("response.data")
        console.log("response.data")
        console.log("response.data")
        if(response.data.prediction1 == "home"){
            console.log('resekal');
        }
        if(response.data.prediction1 === "home"
         && response.data.prediction2 === "home"
         && response.data.prediction3 === "home"
         && response.data.prediction4 === "home"
         && response.data.duplication === "false"
         && response.data.videoStatus === "valid"
         ){

            fs.readdir(sourceFolderPath, (err, files) => {
                if (err) throw err;
              
                files.forEach(file => {
                  const sourceFilePath = path.join(sourceFolderPath, file);
                  const destFilePath = path.join(destFolderPath, file);
              
                  const sourceStream = fs.createReadStream(sourceFilePath);
                  const destStream = fs.createWriteStream(destFilePath);
              
                  sourceStream.pipe(destStream);
              
                  sourceStream.on('error', err => {
                    console.error(`Error reading source file ${file}: ${err}`);
                  });
              
                  destStream.on('error', err => {
                    console.error(`Error writing destination file ${file}: ${err}`);
                  });
              
                  destStream.on('finish', () => {
                    console.log(`Copied file ${file} to ${destFolderPath}`);
                  });
                });
              });

         const token = req.cookies.jwt;
        let user_id;

        if(token){
           jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
               if(err){
                   console.log(err.message);
                   user_id = '';
               } else{
                   user_id = decodedToken.id;
               }
           })}
        rental.uid = user_id;   
        rental.save()
        .then(result=>{
            console.log('Successfulyy Uploaded to Database')
        })
        .catch(e =>{
            console.log(e);
        })
         }
         const folderPath = 'C:/webproject/assets/checkphoto';
         fs.readdir(folderPath, (err, files) => {
             if (err) throw err;
           
             for (const file of files) {
               fs.unlink(path.join(folderPath, file), err => {
                 if (err) throw err;
                 console.log(`Deleted ${file}`);
               });
             }
           });
      })
      .catch(error => {
        // console.error(error);
        res.status(400).json({error});
      });
}

module.exports.post_add_rental = (req,res) =>{
    
    const rental = new Rental(req.body);
    rental.pic1 = req.files.pic1[0].filename;
    rental.pic2 = req.files.pic2[0].filename;
    rental.pic3 = req.files.pic3[0].filename;
    rental.pic4 = req.files.pic4[0].filename;
    console.log(rental);
    // const token = req.cookies.jwt;
    // path = 'C:\webproject\assets\homes'
    // let user_id;
    // if(token){
    //    jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
    //        if(err){
    //            console.log(err.message);
    //            user_id = '';
    //        } else{
    //            user_id = decodedToken.id;
    //        }
    //    })}
    // rental.uid = user_id;   
    // rental.save()
    // .then(result=>{
    //     res.redirect("/");
    // })
    // .catch(e =>{
    //     console.log(e);
    // })
}


  module.exports.post_get_report = (req,res) =>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                user_id = '';
            } else{         
                user_id = decodedToken.id; 
            }
        })
    
   const { message, report_self_uid,homeid,report_seller_uid}  = req.body
   let reporter_email 
   let reportee_email
   console.log(req.body)
   
  
   User.find({_id: {$in: [report_self_uid, report_seller_uid]}})
   .then((result)=>{
    length = result.length
    if(length > 0){
        for(let i=0;i<length; i++){
            if(report_self_uid === result[i].id){
                reporter_email = result[i].email
            }
           else{
                reportee_email = result[i].email
            }
        }
    }
    Report.findOne({ reportee_email: reportee_email }, (err, reportt) => {
        if(reportt){
            if (err) throw err;
            console.log(reportt); // Log the user document to the console
            reportt.message += ','+message
            reportt.reporter_email += ','+reporter_email
            console.log(reportt)
            
            reportt.save()
            .then(()=>{
                res.redirect('/')
            })
            .catch((e)=>{
                console.log(e);
            })
        }
        else{
            req.body = {message,reporter_email,reportee_email,homeid}
            const report = new Report(req.body);
            
            report.save()
            .then(()=>{
                res.redirect('/')
            })
            .catch((e)=>{
                console.log(e);
            })   
        }
      });
   })
   .catch((e)=>{
    console.log(e)
   })
  
  }
}
   

  module.exports.get_rkp_estimator = (req,res) =>{
    res.render("rkp_estimator", {title:"RKP estimators",naveprofile:"", displayer:2})
  }

  module.exports.post_feedback = (req,res) =>{
    const feedback = new Feedback(req.body);
    feedback.save()
    .then(()=>{
        res.redirect('/contact_us')
    })
    .catch((e)=>{
        console.log(e);
    })
   
  }

  module.exports.post_filter_index = (req,res) =>{
    console.log('I am in filter')
    console.log(req.query)

    const token = req.cookies.jwt;
    let location_list;
     
   getFromFrontEnd = req.query;

    location_list = getFromFrontEnd.location.split(/[ ,]+/).filter(Boolean);
   
   if(getFromFrontEnd.price_min === 'any'){
    getFromFrontEnd.price_min = 0;
   }
   if(getFromFrontEnd.price_max === 'any'){
    getFromFrontEnd.price_max = 10000000000;
    }
    if(getFromFrontEnd.bedroom_min === 'any'){
        getFromFrontEnd.bedroom_min = 0;
    }
    if(getFromFrontEnd.bedroom_max === 'any'){
        getFromFrontEnd.bedroom_max = 1000000;
    }
    if(getFromFrontEnd.bathroom_min === 'any'){
        getFromFrontEnd.bathroom_min = 0;
    }
    if(getFromFrontEnd.bathroom_max === 'any'){
        getFromFrontEnd.bathroom_max = 1000000;
    }
  console.log("--------------------------------------------------")
  console.log(getFromFrontEnd)
  console.log("--------------------------------------------------")
    // if user exist
    let language;
    let user_id,user_id_who_rated, home_id,array_of_user_id_who_rated,home_id_value,user_id_value,rating_value,obj;
    var array_of_home_id_and_rating = [];
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{         
               user_id = decodedToken.id; 
           }
       })
       User.findById(user_id)
       .then((rasu)=>{
        Rental.find()
        .then((result) =>{
            let length = result.length;
            let rental = [];
            for(let i=0; i<length ; i++){
               if(result[i].price >= getFromFrontEnd.price_min && result[i].price <= getFromFrontEnd.price_max){
                   if(result[i].bedroom >= getFromFrontEnd.bedroom_min && result[i].bedroom <= getFromFrontEnd.bedroom_max){
                       if(result[i].bathroom >= getFromFrontEnd.bathroom_min && result[i].bathroom <= getFromFrontEnd.bathroom_max){
                        
                        for(let j =0; j<location_list.length ; j++){
                          
                            if(location_list[j]==="any"){
                                if(user_id !== result[i].uid && getFromFrontEnd.type==="any"){
                                    rental.push(result[i]);   
                                }
                                else if( user_id !== result[i].uid && getFromFrontEnd.type==="rent"){
                                    if(result[i].type==="rent"){
                                        rental.push(result[i]);
                                    }
                                }
                                 else if( user_id !== result[i].uid && getFromFrontEnd.type==="sell"){
                                    if(result[i].type==="sell"){
                                        rental.push(result[i]);
                                    }
                                 } 
                            
                              
                            }
                           else{
                            if(user_id !== result[i].uid && getFromFrontEnd.type==="any"){
                                rental.push(result[i]);   
                            }
                            else if( user_id !== result[i].uid && getFromFrontEnd.type==="rent"){
                                if(result[i].type==="rent"){
                                    rental.push(result[i]);
                                }
                            }
                             else if(user_id !== result[i].uid && getFromFrontEnd.type==="sell"){
                                if(result[i].type==="sell"){
                                    rental.push(result[i]);
                                }
                             } 
                        
                           }
                        }
                          
       
                       }
       
                   }
               }
              
            }
            
            Savedhome.find()
            .then((cart_logger)=>{
                let total_length = cart_logger.length;
                let displayer = [];
                for(let j=0 ; j<total_length; j++){
                    if(user_id === cart_logger[j].uid){
                        displayer.push(cart_logger[j]);
                    }
                }
            })
            .catch(e=>console.log(e));
            Language.find()
            .then((roba)=>{
                if(roba.length > 0){
                    for(let i = 0; i< roba.length; i++){
                        if(roba[i].uid === user_id){
                            language = roba[i].language;
                            break;
                        }
                        else{
                            if(i === roba.length-1){
                                language = 'english';
                                break;
                            }
                        }
                        
                    }
                    Rating.find()
                    .then((ratings)=>{
                        if(ratings.length>0){
                            for(let a =0; a<ratings.length; a++){
                                user_id_who_rated = ratings[a].user_id;
                                console.log(user_id_who_rated)
                                
                                console.log(ratings.length)
                                console.log(user_id_who_rated.split(/[ ,]+/).filter(Boolean))
                              
                                home_id = ratings[a].home_id;
                                if(user_id_who_rated !== ''){
                                    array_of_user_id_who_rated = user_id_who_rated.split(/[ ,]+/).filter(Boolean);
                                }
                             
                                   
                               
                                home_id_value = home_id; 
                                user_id_value = array_of_user_id_who_rated;
                                rating_value = ratings[a].rating_number;
                               
                                     obj ={
                                        'home_id' : home_id_value,
                                        'user_id' : user_id_value,
                                        'rating_id' : rating_value
                                    };
                                    array_of_home_id_and_rating.push(obj);
                                
                            }
                           
                            if(language === 'amharic'){
                                res.render("available_homes -Amh", {title: 'available-now', rental, naveprofile: rasu.profilepicture, displayer: displayer.length,array_of_home_id_and_rating});
                            }
                            else{
                                res.render("available_homes", {title: 'available-now', rental, naveprofile: rasu.profilepicture, displayer: displayer.length,array_of_home_id_and_rating});
                            }
                            
                        }
                    })
                   
                   
                }
               
            })
           
        })
        .catch(e =>{
            console.log(e);
        })
       })
       .catch(e =>{
           console.log(e);
       })
       
   }
    //if user doesnot exis
   else{
    Rental.find()
    .then((result) =>{
      let length = result.length;
      let rental = [];
      for(let i=0; i<length ; i++){
        if(result[i].price >= getFromFrontEnd.price_min && result[i].price <= getFromFrontEnd.price_max){
            if(result[i].bedroom >= getFromFrontEnd.bedroom_min && result[i].bedroom <= getFromFrontEnd.bedroom_max){
                if(result[i].bathroom >= getFromFrontEnd.bathroom_min && result[i].bathroom <= getFromFrontEnd.bathroom_max){
                for(let j =0; j<location_list.length ; j++){
                          
                            if(location_list[j]==="any"){
                                if(getFromFrontEnd.type==="any"){
                                    rental.push(result[i]);   
                                }
                                else if(getFromFrontEnd.type==="rent"){
                                    if(result[i].type==="rent"){
                                        rental.push(result[i]);
                                    }
                                }
                                 else if(getFromFrontEnd.type==="sell"){
                                    if(result[i].type==="sell"){
                                        rental.push(result[i]);
                                    }
                                 } 
                            
                              
                            }
                           else{
                            if(getFromFrontEnd.type==="any"){
                                rental.push(result[i]);   
                            }
                            else if(getFromFrontEnd.type==="rent"){
                                if(result[i].type==="rent"){
                                    rental.push(result[i]);
                                }
                            }
                             else if(getFromFrontEnd.type==="sell"){
                                if(result[i].type==="sell"){
                                    rental.push(result[i]);
                                }
                             } 
                        
                           }
                        }

                }

            }
        }
       
     }
     

      res.render("available_homes", {title: 'available-now', rental, naveprofile: "", displayer: "",array_of_home_id_and_rating : ""});
      
    })
    .catch((e)=>{
     console.log(e);
    })
   }

  }

  module.exports.get_log_in = (req,res) =>{
    res.render("login",{title: 'log in', naveprofile:""})
  }

  module.exports.get_register = (req,res) =>{
    res.render("register",{title: 'register', naveprofile:""})
  }

  module.exports.get_about_us = (req,res) =>{
    res.render("about_us",{title: 'about_developer', naveprofile: ''});
  }

  module.exports.get_contact_us = (req,res) =>{
    const token = req.cookies.jwt;
    let user_id;
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{
               user_id = decodedToken.id;   
           }
       })
       User.findById(user_id)
       .then((result)=>{
        Savedhome.find()
        .then((cart)=>{
            let length = cart.length;
            let displayer = [];

            for(let i = 0; i<length; i++){
                if(cart[i].uid === user_id){
                    displayer.push(cart[i]);
                }
            }
            res.render("contact_us",{title: 'contact_us', naveprofile: result.profilepicture, displayer:displayer.length});
        })
       })
      


     }
     else{
        res.render("contact_us",{title: 'contact_us', naveprofile: ""});
     }
   
  }

  module.exports.post_rating = (req,res) =>{
    let getArrayKey = Object.keys(req.body)
    let previous_rating,current_rating,average_rating,array_of_current_rated, previous_user_id_who_rated ,updated_user_id_who_rated ;
    let flag = 0;
    req.body['rating_number'] = req.body[getArrayKey[0]];
    req.body['home_id'] = req.body[getArrayKey[1]];

    delete req.body[getArrayKey[0]];
    delete req.body[getArrayKey[1]];

    const token = req.cookies.jwt;
    let user_id;
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{
               user_id = decodedToken.id;   
           }
       })
     }
     req.body['user_id'] = user_id
     const rating = new Rating(req.body);
   

     Rating.find()
     .then((ratings) =>{
      if(ratings.length>0){
          for(let i=0; i<ratings.length ; i++){
            
            if(ratings[i].home_id !== req.body.home_id){
                console.log(ratings[i].home_id,req.body.home_id,i)

                if(i === ratings.length-1){
                    // the home is not rated yet
                    if(flag === 0){
                        rating.save()
                    .then((result)=>{
                        res.redirect('/available_homes');
                    })
                    .catch((e)=>{
                        console.log(e);
                    })
                    break;
                    }
                    
                }

            }
            else if(ratings[i].home_id === req.body.home_id){
                console.log(ratings[i].home_id,req.body.home_id,i)
                 // geting the user id of the user who rated the home with iteration
            previous_user_id_who_rated = ratings[i].user_id;
            console.log(previous_user_id_who_rated)
            array_of_current_rated = previous_user_id_who_rated.split(/[ ,]+/).filter(Boolean);
            console.log(array_of_current_rated.length);
           
            for(let a = 0 ; a<array_of_current_rated.length ; a++){
              
                if(user_id !== array_of_current_rated[a]){
                    if(a === array_of_current_rated.length-1 ){
                          //the user are not rating yet at the specific home 
                          //the home is rated before
                          previous_rating = Number(ratings[i].rating_number);
                          current_rating = Number(req.body.rating_number);
                          sum= previous_rating + current_rating;
                          average_rating = ((previous_rating + current_rating)/2);
                          previous_user_id_who_rated = ratings[i].user_id;
                          updated_user_id_who_rated = previous_user_id_who_rated + ','+ user_id;
                         console.log('previous_user_id_who_rated: ', previous_user_id_who_rated)
                         console.log('updated_user_id_who_rated: ', updated_user_id_who_rated)      
                         Rating.findByIdAndUpdate(ratings[i].id, {rating_number: average_rating, user_id:updated_user_id_who_rated},{new:true}, function(err, docs){
                             if(err){
                                 console.log(err);
                             }
                             else{
                                 console.log("Updated Document: ", docs);
                                 res.redirect('/available_homes');
                             }
                         });
                         flag = 1;
                         break;

                    }

                }
                else if(user_id === array_of_current_rated[a]){
                    console.log('you already rate the house!!!')
                    flag = 1;
                    break;
                }
                
            }
            }
        }
    }
    else{
        rating.save()
        .then((result)=>{
            res.redirect('/available_homes');
        })
        .catch((e)=>{
            console.log(e);
        })
    }
})




    //           if(user_id !== ratings[i].user_id){
    //               if(i === ratings.length-1){
    //                 //the user are not rating yet at the total 
    //                 for(let j=0 ; j<ratings.length ; j++){
    //                     //check the home is rated before
    //                     if(req.body.home_id === ratings[j].home_id){
    //                         //the home is rated before
    //                          previous_rating = Number(ratings[j].rating_number);
    //                          current_rating = Number(req.body.rating_number);
    //                          sum= previous_rating + current_rating;
    //                          average_rating = ((previous_rating + current_rating)/2);
    //                          previous_user_id_who_rated = ratings[j].user_id;
    //                          updated_user_id_who_rated = previous_user_id_who_rated + ','+ user_id;
    //                         console.log('previous_user_id_who_rated: ', previous_user_id_who_rated)
    //                         console.log('updated_user_id_who_rated: ', updated_user_id_who_rated)      
    //                         Rating.findByIdAndUpdate(ratings[j].id, {rating_number: average_rating, user_id:updated_user_id_who_rated},{new:true}, function(err, docs){
    //                             if(err){
    //                                 console.log(err);
    //                             }
    //                             else{
    //                                 console.log("Updated Document: ", docs);
    //                                 res.redirect('/available_homes');
    //                             }
    //                         });
    //                         break;
    //                     }
    //                     else{
    //                         if(j === ratings.length-1){
    //                             // the home is not rated before
    //                             rating.save()
    //                             .then((result)=>{
    //                                 res.redirect('/available_homes');
    //                             })
    //                             .catch((e)=>{
    //                                 console.log(e);
    //                             })
    //                             break;
    //                         }
    //                     }
    //                 }
                   
    //               }
    //           }
    //           else{
    //             if(req.body.home_id !== ratings[i].home_id){
    //                 if(i === ratings.length-1){
    //                     for(let j=0 ; j<ratings.length ; j++){
    //                         if(req.body.home_id === ratings[j].home_id){
    //                              previous_rating = Number(ratings[j].rating_number);
    //                              current_rating = Number(req.body.rating_number);
    //                              sum= previous_rating + current_rating;
    //                              average_rating = ((previous_rating + current_rating)/2);
    //                             console.log('previousRAting: ', previous_rating)
    //                             console.log('currentRating: ', current_rating)
    //                             console.log('sum: ', sum)
    //                             console.log('average rating: ', average_rating)
    
                              
    //                             Rating.findByIdAndUpdate(ratings[j].id, {rating_number: average_rating},{new:true}, function(err, docs){
    //                                 if(err){
    //                                     console.log(err);
    //                                 }
    //                                 else{
    //                                     console.log("Updated Document: ", docs);
    //                                     res.redirect('/available_homes');
    //                                 }
    //                             });
    //                             break;
    //                         }
    //                         else{
    //                             if(j === ratings.length-1){
    //                                 rating.save()
    //                                 .then((result)=>{
    //                                     res.redirect('/available_homes');
    //                                 })
    //                                 .catch((e)=>{
    //                                     console.log(e);
    //                                 })
    //                                 break;
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //           }
    //       }
        
    //   }
    //   else{
    //     rating.save()
    //     .then((result)=>{
    //         res.redirect('/available_homes');
    //     })
    //     .catch((e)=>{
    //         console.log(e);
    //     })
    //   }
      
    //  })

  



  }

  module.exports.get_success = (req,res) =>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "55"
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('<script>alert("Payment Successful"); window.location.href = "/"; </script>');
        }
    });
  }

  module.exports.post_pay = (req,res) =>{
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "house",
                    "sku": "001",
                    "price": "55",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "55"
            },
            "description": "For Renting Purpose."
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
           for(let i = 0; i< payment.links.length; i++){
            if(payment.links[i].rel === "approval_url"){
                res.redirect(payment.links[i].href);
            }
           }
        }
    });
  }

  module.exports.post_payment = (req,res)=>{
    console.log('tegbar')
    console.log(req.body)
    console.log('tegbar')
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'Robel Asfaw',
            address: {
                line1: 'kebele 05 sefere selam Injibara',
                postal_code: '1102401',
            city: 'Injibara',
            state: 'Amhara',
            country: 'Ethiopia',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: parseFloat(req.body.amount),     // Charging Rs 25
            description: 'For Renting Purpose',
            currency: 'ETB',
            customer: customer.id
        },function(err, ress){
            console.log(ress);
            res.send(`<script>alert("the transaction made successfully with tx-id: ${ress.balance_transaction} do you want receipt? "); window.location.href = "${ress.receipt_url}"; </script>`);
        });
    } )
    // .then((charge) => {
    //     res.send("Success")  // If no error occurs
    // })
    // .catch((err) => {
    //     console.log(err);       // If some error occurs
    // });
    
  }
  
module.exports.get_language_preference = (req,res) =>{
 
   console.log(req.params.id)
   const token = req.cookies.jwt;
   let user_id;
   if(token){
      jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
          if(err){
              console.log(err.message);
              user_id = '';
          } else{
              user_id = decodedToken.id;   
          }
      })
    }
    const ind_lan_pref = new Language({uid:user_id,language:req.params.id});

    Language.find()
    .then((roba)=>{
        if(roba.length > 0){
            
            for(let i = 0; i< roba.length; i++){
                if(roba[i].uid === user_id){
                    let doc_id = roba[i].id; 
                    Language.findByIdAndUpdate(doc_id,{language:req.params.id},{ new: true },function (err,docs){
                        if (err){
                            console.log(err)
                        }
                        else{
                            console.log("Updated Documnet : ", docs);
                        }
                    })
                    break;
                }
                else{

                    if(i === roba.length-1){
                       
                        ind_lan_pref.save()
                        .then((aa)=>{
                            res.send('<script> window.location.href = "/";</script>');
                        })
                        .catch((e)=>{
                            console.log(e);
                        })
                    }
                }
            }
            res.send('<script> window.location.href = "/";</script>');

        }
        else{
            ind_lan_pref.save()
            .then((aa)=>{
                res.send('<script> window.location.href = "/";</script>');
            })
            .catch((e)=>{
                console.log(e);
            })
        }
    })
    .catch(e=>{
        console.log(e);
    })

    
    
}

module.exports.post_change_post = (req,res) =>{
    const sourceFolderPath  = 'C:/webproject/assets/checkphoto';
    const destFolderPath  = 'C:/webproject/assets/homes';
    const id = req.params.id;
    const token = req.cookies.jwt;
    let user_id;
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{
               user_id = decodedToken.id;   
           }
       })}
    Rental.findById(id)
    .then((result) =>{
        prev_post = req.body;
    
        if(!('Rented' in prev_post)){
           prev_post.Rented = 'false';
        }
        else{
            if(prev_post.Rented === ''){
                prev_post.Rented = 'true';
            }
        }
     const renamed_keys = {Pic1: 'pic1', Pic2:'pic2',Pic3:'pic3',Pic4:'pic4'};
     const renamed_objects = renameKeys(prev_post,renamed_keys)
     console.log(renamed_objects);
    
     function renameKeys(obj, newKeys) {
        const keyValues = Object.keys(obj).map(key => {
          const newKey = newKeys[key] || key;
          return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
      }
    
       const rental = new Rental(renamed_objects);
       
          if(!(rental.pic1 === '')){
                rental.pic1 = req.files.pic1[0].filename;
            }
          else{
            rental.pic1 = result.pic1;
            }
         if(!(rental.pic2 === '')){
                rental.pic2 = req.files.pic2[0].filename;
            }
          else{
            rental.pic2 = result.pic2;
            }
        if(!(rental.pic3 === '')){
                rental.pic3 = req.files.pic3[0].filename;
            }
          else{
            rental.pic3 = result.pic3;
            }
        if(!(rental.pic4 === '')){
                rental.pic4 = req.files.pic4[0].filename;
            }
          else{
            rental.pic4 = result.pic4;
            }

            //update the rental document

            Rental.findByIdAndUpdate(id,{
                name: rental.name,
                phonenumber: rental.phonenumber,
                price: rental.price,
                bedroom: rental.bedroom,
                bathroom: rental.bathroom,
                location: rental.location,
                sqrt: rental.sqrt,
                additionalfeature: rental.additionalfeature,
                Rented: rental.Rented,
                pic1: rental.pic1,
                pic2: rental.pic2,
                pic3: rental.pic3,
                pic4: rental.pic4,
            },{ new: true },function (err,docs){
                if (err){
                    console.log(err)
                }
                else{
                    console.log("Updated Documnet : ", docs);
                    fs.readdir(sourceFolderPath, (err, files) => {
                        if (err) throw err;
                      
                        files.forEach(file => {
                          const sourceFilePath = path.join(sourceFolderPath, file);
                          const destFilePath = path.join(destFolderPath, file);
                      
                          const sourceStream = fs.createReadStream(sourceFilePath);
                          const destStream = fs.createWriteStream(destFilePath);
                      
                          sourceStream.pipe(destStream);
                      
                          sourceStream.on('error', err => {
                            console.error(`Error reading source file ${file}: ${err}`);
                          });
                      
                          destStream.on('error', err => {
                            console.error(`Error writing destination file ${file}: ${err}`);
                          });
                      
                          destStream.on('finish', () => {
                            console.log(`Copied file ${file} to ${destFolderPath}`);
                          });
                        });
                      });

                      const folderPath = 'C:/webproject/assets/checkphoto';
                                fs.readdir(folderPath, (err, files) => {
                                    if (err) throw err;
                                
                                    for (const file of files) {
                                    fs.unlink(path.join(folderPath, file), err => {
                                        if (err) throw err;
                                        console.log(`Deleted ${file}`);
                                    });
                                    }
                                });
        
                }
            })
            res.send('<script> window.location.href = "/";</script>');
            // res.send('<script> window.location.href = "/"; </script>');
       
    })
    .catch((e)=>{
        console.log(e);
    })
}

module.exports.get_posts = (req,res) =>{
    const id = req.params.id;
    const token = req.cookies.jwt;
    let user_id;
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{
               user_id = decodedToken.id;   
           }
       })
       User.findById(user_id)
       .then((rasu)=>{
        User.findById(id)
        .then((result)=>{
            Rental.find()
            .then((posts) =>{
                total_length = posts.length;
                history = [];

                for(let j=0 ; j<total_length; j++){
                    if(user_id === posts[j].uid){
                        history.push(posts[j]);
                    }
                }
                console.log(history);
                Savedhome.find()
                .then((cart_logger)=>{
                    total_length = cart_logger.length;
                    displayer = [];
                    for(let j=0 ; j<total_length; j++){
                        if(user_id === cart_logger[j].uid){
                            displayer.push(cart_logger[j]);
                        }
                    }
                })
                .catch(e=>console.log(e));
                  res.render("posts",{title: 'preveous posts', profile: history,naveprofile:rasu.profilepicture, displayer: displayer.length});

            })
            .catch(e=>console.log(e));
           
           
          
        })
        .catch(e =>{
            console.log(e);
        })
       })
       .catch(e =>{
           console.log(e);
       })
   }
  
}

module.exports.post_compare_homes = (req,res) =>{
    console.log('robel asfaw')
    // console.log(req.body.form_check_input_compare);
    let compare_homes = [];
    let language;
    var sent_compare = [];
    // console.log(req.body.form_check_input_compare.length);
    for (let i=0; i< req.body.form_check_input_compare.length; i++){
        if(!(req.body.form_check_input_compare[i] === '')){
            compare_homes.push(req.body.form_check_input_compare[i])
        }
    }
    // console.log(compare_homes);
    const token = req.cookies.jwt;
    let user_id;
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{         
               user_id = decodedToken.id; 
           }
       })
       User.findById(user_id)
       .then((rasu)=>{
        Rental.find()
        .then((result) =>{
            Savedhome.find()
            .then((cart_logger)=>{
                let total_length = cart_logger.length;
                let displayer = [];
                for(let j=0 ; j<total_length; j++){
                    if(user_id === cart_logger[j].uid){
                        displayer.push(cart_logger[j]);
                    }
                }
            })
            .catch(e=>console.log(e));

        
            
            for(let i = 0 ; i< compare_homes.length ; i++){
                for(let j = 0 ; j < result.length ; j++){
                    if(compare_homes[i] === result[j].id){
                        sent_compare.push(result[j]);
                    }
                }
            }
            Language.find()
            .then((roba)=>{
                if(roba.length > 0){
                    for(let i = 0; i< roba.length; i++){
                        if(roba[i].uid === user_id){
                            language = roba[i].language;
                            break;
                        }
                        else{
                            if(i === roba.length-1){
                                language = 'english';
                                break;
                            }
                        }
                        
                    }
                    if(language === 'amharic'){
                        res.render("compare_homes -Amh", {title: 'compare_homes', rental: sent_compare, naveprofile: rasu.profilepicture, displayer: displayer.length});
                    }
                    else{
                        res.render("compare_homes", {title: 'compare_homes', rental: sent_compare, naveprofile: rasu.profilepicture, displayer: displayer.length});
                    }
                   
                }
               
            })
            
        })
        .catch(e =>{
            console.log(e);
        })
       })
       .catch(e =>{
           console.log(e);
       })
       
   }
  
}

module.exports.post_filter_view = (req,res) =>{
    console.log(req.body);
    const token = req.cookies.jwt;
   let user_id;
    const {
           kebele_1,
           kebele_2,
           kebele_3,
           kebele_4,
           kebele_5,
           kebele_6,
           kebele_7,
           kebele_8,
           kebele_9,
           kebele_10,
           kebele_11,
           kebele_12,
           kebele_13,
           kebele_14,
           kebele_15,
           kebele_16,
           kebele_17,
           kebele_18,
           minimum_value,
           maximum_value,

    } = req.body;
   ///////////////////////////////////////
   if(token){
    jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
        if(err){
            console.log(err.message);
            user_id = '';
        } else{       
            user_id = decodedToken.id;
            
        }
    })
    User.findById(user_id)
    .then((rasu)=>{
        Rental.find()
        .then((result) =>{
               const available_home_length = result.length;
               let filtered_homes = [];
               for(let i = 0; i < available_home_length ; i++){
                console.log(result[i].location);
                   if(
                       kebele_1 === result[i].location ||
                       kebele_2 === result[i].location ||
                       kebele_3 === result[i].location ||
                       kebele_4 === result[i].location ||
                       kebele_5 === result[i].location ||
                       kebele_6 === result[i].location ||
                       kebele_7 === result[i].location ||
                       kebele_8 === result[i].location ||
                       kebele_9 === result[i].location ||
                       kebele_10 === result[i].location ||
                       kebele_11 === result[i].location ||
                       kebele_12 === result[i].location ||
                       kebele_13 === result[i].location ||
                       kebele_14 === result[i].location ||
                       kebele_15 === result[i].location ||
                       kebele_16 === result[i].location ||
                       kebele_17 === result[i].location ||
                       kebele_18 === result[i].location 
                       ){
                        console.log('upper');
                           if(minimum_value != '' && maximum_value != ''){
                            console.log('inside');
                               if(result[i].price >= minimum_value && result[i].price < maximum_value){
                                   filtered_homes.push(result[i]);
                               }
                           }
                           else if(minimum_value != '' && maximum_value == ''){
                               if(result[i].price >= minimum_value && result[i].price < 1000000){
                                   filtered_homes.push(result[i]);
                               }
                           }
                           else if(minimum_value == '' && maximum_value != ''){
                               if(result[i].price >= 0 && result[i].price < maximum_value){
                                   filtered_homes.push(result[i]);
                               }
                           }
                           else{
                               filtered_homes.push(result[i]);
                           }
                       }
                       else if(minimum_value != '' && maximum_value != ''){
                           if(result[i].price >= minimum_value && result[i].price < maximum_value){
                               filtered_homes.push(result[i]);
                           }
                       }
                       else if(minimum_value != '' && maximum_value == ''){
                           if(result[i].price >= minimum_value && result[i].price < 1000000){
                               filtered_homes.push(result[i]);
                           }
                       }
                       else if(minimum_value == '' && maximum_value != ''){
                           if(result[i].price >= 0 && result[i].price < maximum_value){
                               filtered_homes.push(result[i]);
                           }
                       }
                       else{
                        filtered_homes = result;
                       }
               }
            Savedhome.find()
            .then((cart_logger)=>{
                total_length = cart_logger.length;
                displayer = [];
                for(let j=0 ; j<total_length; j++){
                    if(user_id === cart_logger[j].uid){
                        displayer.push(cart_logger[j]);
                    }
                }
            })
            .catch(e=>console.log(e));
            console.log(filtered_homes);
            res.render("available_homes", {title: 'available-now', rental: filtered_homes, naveprofile: rasu.profilepicture, displayer:displayer.length});
        })
        .catch(e =>{
            res.status(201).json({path:"/available_homes", title: 'available-now', rental: filtered_homes, naveprofile: rasu.profilepicture, displayer:displayer.length});
        })
    })
    .catch(e =>{
        console.log(e);
    })
}
   //////////////////////////////////////
//    const token = req.cookies.jwt;
//    let user_id;
//    if(token){
//       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
//           if(err){
//               console.log(err.message);
//               user_id = '';
//           } else{         
//               user_id = decodedToken.id; 
//           }
//       })
//       User.findById(user_id)
//       .then((rasu)=>{
//        Rental.find()
//        .then((result) =>{
//            Savedhome.find()
//            .then((cart_logger)=>{
//                let total_length = cart_logger.length;
//                let displayer = [];
//                for(let j=0 ; j<total_length; j++){
//                    if(user_id === cart_logger[j].uid){
//                        displayer.push(cart_logger[j]);
//                    }
//                }
//            })
//            .catch(e=>console.log(e));
//            let available_home_length = result.length;
//                let filtered_homes = [];
//                for(let i = 0; i < available_home_length ; i++){
//                    if(
//                        kebele_1 === result[i].location ||
//                        kebele_2 === result[i].location ||
//                        kebele_3 === result[i].location ||
//                        kebele_4 === result[i].location ||
//                        kebele_5 === result[i].location ||
//                        kebele_6 === result[i].location ||
//                        kebele_7 === result[i].location ||
//                        kebele_8 === result[i].location ||
//                        kebele_9 === result[i].location ||
//                        kebele_10 === result[i].location ||
//                        kebele_11 === result[i].location ||
//                        kebele_12 === result[i].location ||
//                        kebele_13 === result[i].location ||
//                        kebele_14 === result[i].location ||
//                        kebele_15 === result[i].location ||
//                        kebele_16 === result[i].location ||
//                        kebele_17 === result[i].location ||
//                        kebele_18 === result[i].location 
//                        ){
//                         console.log('upper');
//                            if(minimum_value != '' && maximum_value != ''){
//                             console.log('inside');
//                                if(result[i].price >= minimum_value && result[i].price < maximum_value){
//                                    filtered_homes.push(result[i]);
//                                }
//                            }
//                            else if(minimum_value != '' && maximum_value == ''){
//                                if(result[i].price >= minimum_value && result[i].price < 1000000){
//                                    filtered_homes.push(result[i]);
//                                }
//                            }
//                            else if(minimum_value == '' && maximum_value != ''){
//                                if(result[i].price >= 0 && result[i].price < maximum_value){
//                                    filtered_homes.push(result[i]);
//                                }
//                            }
//                            else{
//                                filtered_homes.push(result[i]);
//                            }
//                        }
//                        else if(minimum_value != '' && maximum_value != ''){
//                            if(result[i].price >= minimum_value && result[i].price < maximum_value){
//                                filtered_homes.push(result[i]);
//                            }
//                        }
//                        else if(minimum_value != '' && maximum_value == ''){
//                            if(result[i].price >= minimum_value && result[i].price < 1000000){
//                                filtered_homes.push(result[i]);
//                            }
//                        }
//                        else if(minimum_value == '' && maximum_value != ''){
//                            if(result[i].price >= 0 && result[i].price < maximum_value){
//                                filtered_homes.push(result[i]);
//                            }
//                        }
//                }
//                console.log(filtered_homes);
//                console.log('sdfgh');
//            res.render("available_homes", {title: 'available-now', rental: filtered_homes, naveprofile: rasu.profilepicture, displayer: displayer.length});
           
//        })
//        .catch(e =>{
//            console.log(e);
//        })
//       })
//       .catch(e =>{
//           console.log(e);
//       })
      
//   }
  else{
   Rental.find()
   .then((result) =>{
    let available_home_length = result.length;
    let filtered_homes = [];
    for(let i = 0; i < available_home_length ; i++){
        if(
            kebele_1 === result[i].location ||
            kebele_2 === result[i].location ||
            kebele_3 === result[i].location ||
            kebele_4 === result[i].location ||
            kebele_5 === result[i].location ||
            kebele_6 === result[i].location ||
            kebele_7 === result[i].location ||
            kebele_8 === result[i].location ||
            kebele_9 === result[i].location ||
            kebele_10 === result[i].location ||
            kebele_11 === result[i].location ||
            kebele_12 === result[i].location ||
            kebele_13 === result[i].location ||
            kebele_14 === result[i].location ||
            kebele_15 === result[i].location ||
            kebele_16 === result[i].location ||
            kebele_17 === result[i].location ||
            kebele_18 === result[i].location 
            ){
                if(minimum_value != '' && maximum_value != ''){
                    if(result[i].price >= minimum_value && result[i].price < maximum_value){
                        filtered_homes.push(result[i]);
                    }
                }
                else if(minimum_value != '' && maximum_value == ''){
                    if(result[i].price >= minimum_value && result[i].price < 1000000){
                        filtered_homes.push(result[i]);
                    }
                }
                else if(minimum_value == '' && maximum_value != ''){
                    if(result[i].price >= 0 && result[i].price < maximum_value){
                        filtered_homes.push(result[i]);
                    }
                }
                else{
                    filtered_homes.push(result[i]);
                }
            }
            else if(minimum_value != '' && maximum_value != ''){
                if(result[i].price >= minimum_value && result[i].price < maximum_value){
                    filtered_homes.push(result[i]);
                }
            }
            else if(minimum_value != '' && maximum_value == ''){
                if(result[i].price >= minimum_value && result[i].price < 1000000){
                    filtered_homes.push(result[i]);
                }
            }
            else if(minimum_value == '' && maximum_value != ''){
                if(result[i].price >= 0 && result[i].price < maximum_value){
                    filtered_homes.push(result[i]);
                }
            }
    }
    console.log(filtered_homes);
       res.render("available_homes", {title: 'available-now', rental: filtered_homes, naveprofile: '', displayer: 0});
   })
   .catch(e =>{
       console.log(e);
   })
  }
 
    ///////////////////////////////////////////////
//     Rental.find()
//     .then((result)=>{
//         let available_home_length = result.length;
//         let filtered_homes = [];
//         for(let i = 0; i < available_home_length ; i++){
//             if(
//                 kebele_1 === result[i].location ||
//                 kebele_2 === result[i].location ||
//                 kebele_3 === result[i].location ||
//                 kebele_4 === result[i].location ||
//                 kebele_5 === result[i].location ||
//                 kebele_6 === result[i].location ||
//                 kebele_7 === result[i].location ||
//                 kebele_8 === result[i].location ||
//                 kebele_9 === result[i].location ||
//                 kebele_10 === result[i].location ||
//                 kebele_11 === result[i].location ||
//                 kebele_12 === result[i].location ||
//                 kebele_13 === result[i].location ||
//                 kebele_14 === result[i].location ||
//                 kebele_15 === result[i].location ||
//                 kebele_16 === result[i].location ||
//                 kebele_17 === result[i].location ||
//                 kebele_18 === result[i].location 
//                 ){
//                     if(minimum_value != '' && maximum_value != ''){
//                         if(result[i].price >= minimum_value && result[i].price < maximum_value){
//                             filtered_homes.push(result[i]);
//                         }
//                     }
//                     else if(minimum_value != '' && maximum_value == ''){
//                         if(result[i].price >= minimum_value && result[i].price < 1000000){
//                             filtered_homes.push(result[i]);
//                         }
//                     }
//                     else if(minimum_value == '' && maximum_value != ''){
//                         if(result[i].price >= 0 && result[i].price < maximum_value){
//                             filtered_homes.push(result[i]);
//                         }
//                     }
//                     else{
//                         filtered_homes.push(result[i]);
//                     }
//                 }
//                 else if(minimum_value != '' && maximum_value != ''){
//                     if(result[i].price >= minimum_value && result[i].price < maximum_value){
//                         filtered_homes.push(result[i]);
//                     }
//                 }
//                 else if(minimum_value != '' && maximum_value == ''){
//                     if(result[i].price >= minimum_value && result[i].price < 1000000){
//                         filtered_homes.push(result[i]);
//                     }
//                 }
//                 else if(minimum_value == '' && maximum_value != ''){
//                     if(result[i].price >= 0 && result[i].price < maximum_value){
//                         filtered_homes.push(result[i]);
//                     }
//                 }
//         }
//     })
//     .catch((e)=>{
//         console.log(e);
//     })

}

module.exports.get_specific_chatbox = (req,res) =>{
    const id = req.params.id;
    const token = req.cookies.jwt;
    let user_id;
    if(token){
        jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                user_id = '';
            } else{          
                user_id = decodedToken.id; 
            }
        }) 
    }

    User.find()
    .then((au) =>{
        Chat.find()
        .then((result) =>{
          let total_chat = result.length;
          let mychat = [];
          let mychatc = [];
          let hischat = [];
          let conversation = [];
          for(let i = 0 ; i< total_chat ; i ++){
            if(user_id === result[i].self_uid || user_id === result[i].seller_uid){
                mychatc.push(result[i]);
                
            }
            if(user_id === result[i].seller_uid){
                hischat.push(result[i]);
            }

            if(id === result[i].seller_uid || id === result[i].self_uid){
                if(user_id === result[i].seller_uid || user_id === result[i].self_uid){
                    conversation.push(result[i]);
                }
            }
    
          }
         
          for(let i=0; i< mychatc.length; i++){
            if(i===0){
                mychat.push(mychatc[i]);
            }
            else{
                for(let j=0 ; j<i ; j++){
                    if(mychatc[i].seller_uid === mychatc[j].seller_uid ){
                        if(mychatc[i].self_uid === mychatc[j].self_uid){
                            break;
                        }
                    }
                    else if(mychatc[i].seller_uid === mychatc[j].self_uid){
                        if(mychatc[i].self_uid === mychatc[j].seller_uid){
                            break;
                        }
                    }
                    
                        if(j === (i - 1)){
                            mychat.push(mychatc[i]);
                        }
                    
                }
            }
           
           }
         
           
          res.render('chatbox',{title:'chat', naveprofile:'', displayer: 0, mychat,hischat, au, conversation})
        })
        .catch((e)=>{
            console.log(e);
        })
    })
    .catch(e =>{
        console.log(e);
    })
   
}

module.exports.get_chatbox = (req,res) =>{
    const token = req.cookies.jwt;
    let user_id;
    if(token){
        jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                user_id = '';
            } else{
               
                user_id = decodedToken.id;
               
                
            }
        }) 
    }

        User.find()
        .then((au) =>{
            Chat.find()
        .then((result)=>{
        let chatsize = result.length;
        let mychat = [];
        let mychatc = [];
        let hischat = [];
        for(let i =0 ; i<chatsize ; i++ ){
            if(user_id === result[i].self_uid || user_id === result[i].seller_uid){
               
                mychatc.push(result[i]);
                
            }
            if(user_id === result[i].seller_uid){
                hischat.push(result[i]);
            }
                     }
        
            // for(let i = 0 ; mychat.length ; i ++){
            // User.findById(mychat[i].seller_uid)
            // .then((seller_pp) =>{
            //     chatprofile.push(seller_pp.profilepicture); 
            //     console.log(chatprofile);
            // })
            // }

           
           for(let i=0; i< mychatc.length; i++){
            if(i===0){
                mychat.push(mychatc[i]);
            }
            else{
                for(let j=0 ; j<i ; j++){
                    if(mychatc[i].seller_uid === mychatc[j].seller_uid ){
                        if(mychatc[i].self_uid === mychatc[j].self_uid){
                            break;
                        }
                    }
                    else if(mychatc[i].seller_uid === mychatc[j].self_uid){
                        if(mychatc[i].self_uid === mychatc[j].seller_uid){
                            break;
                        }
                    }
                    
                        if(j === (i - 1)){
                            mychat.push(mychatc[i]);
                        }
                    
                }
            }
           
           }
          
         
                     res.render('chatbox',{title:'chat', naveprofile:'', displayer: 0, mychat,hischat, au,conversation: []})
             })
        .catch(e=>{
        console.log(e);
             })
        })
        .catch(e=>{
            console.log(e);
                 })
 

    
  

}

module.exports.post_chatbox = async(req,res) =>{
    console.log(req.body);
     
    const chat = new Chat(req.body);
    chat.save()
    .then((result) =>{
        res.json({redirect: `/chatbox/${req.body.seller_uid}`})
    }) 
    .catch((e) =>
    console.log(e)
    );
}

module.exports.post_serched_data = (req,res) =>{
    const id = req.params.id;

    const token = req.cookies.jwt;
    let user_id;
     if(token){
        jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                user_id = '';
            } else{       
                user_id = decodedToken.id;
                
            }
        })
        User.findById(user_id)
        .then((rasu)=>{
            Rental.find()
            .then((result) =>{
                let rr = [];
                const rentalsize = result.length;
                for(let i=0; i<rentalsize ; i++){
                    if(id === result[i].location){
                        rr.push(result[i]);
                    }
                }
                Savedhome.find()
                .then((cart_logger)=>{
                    total_length = cart_logger.length;
                    displayer = [];
                    for(let j=0 ; j<total_length; j++){
                        if(user_id === cart_logger[j].uid){
                            displayer.push(cart_logger[j]);
                        }
                    }
                })
                .catch(e=>console.log(e));
                console.log(rr);
                res.render("available_homes", {title: 'available-now', rental: rr, naveprofile: rasu.profilepicture, displayer:displayer.length});
            })
            .catch(e =>{
                res.status(201).json({path:"/available_homes", title: 'available-now', rental: rr, naveprofile: rasu.profilepicture, displayer:displayer.length});
            })
        })
        .catch(e =>{
            console.log(e);
        })
    }
    else{
        Rental.find()
        .then((result) =>{
            let rr = [];
            const rentalsize = result.length;
            for(let i=0; i<rentalsize ; i++){
                if(id === result[i].location){
                    rr.push(result[i]);
                }
            }
            console.log(rr);
            res.render("available_homes", {title: 'available-now', rental: rr, naveprofile: '', displayer: 0});
        })
        .catch(e =>{
            res.status(201).json({path:"/available_homes", title: 'available-now', rental: rr, naveprofile: '', displayer: 0});
        })
    }
   
   
}

module.exports.post_delete_savedhome = (req,res) =>{
    const id = req.params.id;
    console.log(req.body);
    const uid = req.body.uid;
    console.log(id);
   Savedhome.find()
   .then((result) =>{
    const savedlength = result.length;
    let rr = [];
    for(let i=0; i<savedlength ; i++){
        if((uid === result[i].uid) && (id === result[i].id)){
            rr.push(result[i]);
        }
        
    }
    // console.log(rr[0]);
    Savedhome.findByIdAndDelete(rr[0]._id)
            .then((result) =>{
                console.log('sucessfully delete the item')
            })
            .catch(e =>{
                console.log(e);
            })
   })
   .catch(e=>{
    console.log(e);
   })
}

module.exports.post_savedhomes = (req,res) =>{
    // console.log('llll')
    // console.log(req.body);
    const savedhome = new Savedhome(req.body);
    savedhome.save()
    .then((result) =>{})
    .catch(e =>{
        console.log(e);
    })
}

module.exports.get_savedhomes = (req,res) =>{
    const token = req.cookies.jwt;
    let user_id;
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{
               console.log('aa');
               console.log(decodedToken.id);
               user_id = decodedToken.id;
               console.log('aa');
               
           }
       })
       User.findById(user_id)
   .then((result)=>{
       Savedhome.find()
       .then((cart_logger)=>{
           total_length = cart_logger.length;
           displayer = [];
           for(let j=0 ; j<total_length; j++){
               if(user_id === cart_logger[j].uid){
                   displayer.push(cart_logger[j]);
               }
           }
           Language.find()
            .then((roba)=>{
                if(roba.length > 0){
                    for(let i = 0; i< roba.length; i++){
                        if(roba[i].uid === user_id){
                            language = roba[i].language;
                            break;
                        }
                        else{
                            if(i === roba.length-1){
                                language = 'english';
                                break;
                            }
                        }
                        
                    }
                    if(language === 'amharic'){
                        res.render("saved_homes -Amh",{title: 'home', naveprofile: result.profilepicture, rental:displayer ,displayer: displayer.length});
                    }
                    else{
                        res.render("saved_homes",{title: 'home', naveprofile: result.profilepicture, rental:displayer ,displayer: displayer.length});
                    }
                   
                }
               
            })
           
       })
       .catch(e=>console.log(e));
      
   })
   .catch(e =>{
       console.log(e);
   })
   }
   else{
       res.render("saved_homes",{title: 'home', naveprofile: ''});
   }
   
}

module.exports.get_individual_house = (req,ress) =>{
    const id = req.params.id;
    const uid = req.body.uid;
    const token = req.cookies.jwt;
    let user_id;
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{
               console.log('aa');
               console.log(decodedToken.id);
               user_id = decodedToken.id;
               console.log('aa');
               
           }
       })
       User.findById(user_id)
       .then((rasu)=>{
        Rental.findById(id)
        .then((result) =>{
            Savedhome.find()
            .then((res) =>{
                Savedhome.find()
                .then((cart_logger)=>{
                    total_length = cart_logger.length;
                    displayer = [];
                    for(let j=0 ; j<total_length; j++){
                        if(user_id === cart_logger[j].uid){
                            displayer.push(cart_logger[j]);
                        }
                    }
                })
                .catch(e=>console.log(e));

                let checking=[];
                const length = res.length;
                for(let i=0; i<length ; i++){
                    if((res[i].uid === uid) && (res[i].id  === id)){
                        checking.push(res[i]);
                    }
                }
                Language.find()
                .then((roba)=>{
                    if(roba.length > 0){
                        for(let i = 0; i< roba.length; i++){
                            if(roba[i].uid === user_id){
                                language = roba[i].language;
                                break;
                            }
                            else{
                                if(i === roba.length-1){
                                    language = 'english';
                                    break;
                                }
                            }
                            
                        }
                        if(language === 'amharic'){
                            ress.render("individual_house -Amh",{title: 'each-house', rental: result, check:checking, naveprofile:rasu.profilepicture, displayer:displayer.length, key: stripepublickey});
                        }
                        else{
                            ress.render("individual_house",{title: 'each-house', rental: result, check:checking, naveprofile:rasu.profilepicture, displayer:displayer.length,key: stripepublickey});
                        }
                       
                    }
                   
                })
                //console.log(checking);
               
                // ress.json({ass: checking});
            })
          
        })
        .catch(e =>{
            console.log(e);
        })
       })
       .catch(e =>{
           console.log(e);
       })
      
   }
  else{
    Rental.findById(id)
    .then((result) =>{
        Savedhome.find()
        .then((res) =>{
            let checking=[];
            const length = res.length;
            for(let i=0; i<length ; i++){
                if((res[i].uid === uid) && (res[i].id  === id)){
                    checking.push(res[i]);
                }
            }
            //console.log(checking);
            ress.render("individual_house",{title: 'each-house', rental: result, check:checking, naveprofile: '', displayer:0 });
            // ress.json({ass: checking});
        })
      
    })
    .catch(e =>{
        console.log(e);
    })
  
    // ress.json({ass: checking});
  }
  
}


module.exports.get_available_homes = (req,res) =>{
    const token = req.cookies.jwt;
    let language;
    let user_id,user_id_who_rated, home_id,array_of_user_id_who_rated,home_id_value,user_id_value,rating_value,obj;
    var array_of_home_id_and_rating = [];
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{         
               user_id = decodedToken.id; 
           }
       })
       User.findById(user_id)
       .then((rasu)=>{
        Rental.find()
        .then((resultt) =>{
            let result =[];
            for(let i=0; i<resultt.length ; i++){
                if(user_id !== resultt[i].uid){
                    result.push(resultt[i]);
                }
            }
            Savedhome.find()
            .then((cart_logger)=>{
                let total_length = cart_logger.length;
                let displayer = [];
                for(let j=0 ; j<total_length; j++){
                    if(user_id === cart_logger[j].uid){
                        displayer.push(cart_logger[j]);
                    }
                }
            })
            .catch(e=>console.log(e));
            Language.find()
            .then((roba)=>{
                if(roba.length > 0){
                    for(let i = 0; i< roba.length; i++){
                        if(roba[i].uid === user_id){
                            language = roba[i].language;
                            break;
                        }
                        else{
                            if(i === roba.length-1){
                                language = 'english';
                                break;
                            }
                        }
                        
                    }
                    Rating.find()
                    .then((ratings)=>{
                        if(ratings.length>0){
                            for(let a =0; a<ratings.length; a++){
                                user_id_who_rated = ratings[a].user_id;
                                console.log(user_id_who_rated)
                                
                                console.log(ratings.length)
                                console.log(user_id_who_rated.split(/[ ,]+/).filter(Boolean))
                              
                                home_id = ratings[a].home_id;
                                if(user_id_who_rated !== ''){
                                    array_of_user_id_who_rated = user_id_who_rated.split(/[ ,]+/).filter(Boolean);
                                }
                             
                                   
                               
                                home_id_value = home_id; 
                                user_id_value = array_of_user_id_who_rated;
                                rating_value = ratings[a].rating_number;
                               
                                     obj ={
                                        'home_id' : home_id_value,
                                        'user_id' : user_id_value,
                                        'rating_id' : rating_value
                                    };
                                    array_of_home_id_and_rating.push(obj);
                                
                            }
                            if(language === 'amharic'){
                                res.render("available_homes -Amh", {title: 'available-now', rental: result, naveprofile: rasu.profilepicture, displayer: displayer.length,array_of_home_id_and_rating});
                            }
                            else{
                                res.render("available_homes", {title: 'available-now', rental: result, naveprofile: rasu.profilepicture, displayer: displayer.length,array_of_home_id_and_rating});
                            }
                            
                        }
                    })
                   
                   
                }
               
            })
           
        })
        .catch(e =>{
            console.log(e);
        })
       })
       .catch(e =>{
           console.log(e);
       })
       
   }
   else{
    Rental.find()
    .then((result) =>{
        console.log(result.length);
        res.render("available_homes", {title: 'available-now', rental: result, naveprofile: '', displayer: 0});
    })
    .catch(e =>{
        console.log(e);
    })
   }
  
}

module.exports.get_profile_id = (req,res) =>{
    const id = req.params.id;
    const token = req.cookies.jwt;
    let user_id;
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{
               user_id = decodedToken.id;   
           }
       })
       User.findById(user_id)
       .then((rasu)=>{
        User.findById(id)
        .then((result)=>{
            Savedhome.find()
            .then((cart_logger)=>{
                total_length = cart_logger.length;
                displayer = [];
                for(let j=0 ; j<total_length; j++){
                    if(user_id === cart_logger[j].uid){
                        displayer.push(cart_logger[j]);
                    }
                }
            })
            .catch(e=>console.log(e));
            res.render("profile",{title: 'profile', profile: result,naveprofile:rasu.profilepicture, displayer: displayer.length});
        })
        .catch(e =>{
            console.log(e);
        })
       })
       .catch(e =>{
           console.log(e);
       })
   }
   else{
   
    User.findById(id)
        .then((result)=>{
            res.render("profile",{title: 'profile', profile: result,naveprofile:'', displayer: 0});
        })
        .catch(e =>{
            console.log(e);
        })
   } 
}

module.exports.post_upload = (req,res) =>{
    const profile = new Profile(req.body);
    console.log(req.body);
    profile.profilepicture = req.file.path;
    profile.save()
    .then(result=>{
        res.redirect("/");
    })
    .catch(e =>{
        console.log(e);
    })
}


module.exports.get_rental_form = (req,res) =>{
    const token = req.cookies.jwt;
    let language;
    let user_id;
    if(token){
       jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
           if(err){
               console.log(err.message);
               user_id = '';
           } else{
               console.log('aa');
               console.log(decodedToken.id);
               user_id = decodedToken.id;
               console.log('aa');
               
           }
       })
       User.findById(user_id)
       .then((rasu)=>{
        Savedhome.find()
        .then((cart_logger)=>{
            total_length = cart_logger.length;
            displayer = [];
            for(let j=0 ; j<total_length; j++){
                if(user_id === cart_logger[j].uid){
                    displayer.push(cart_logger[j]);
                }
            }
        })
        .catch(e=>console.log(e));
        Language.find()
            .then((roba)=>{
                if(roba.length > 0){
                    for(let i = 0; i< roba.length; i++){
                        if(roba[i].uid === user_id){
                            language = roba[i].language;
                            break;
                        }
                        else{
                            if(i === roba.length-1){
                                language = 'english';
                                break;
                            }
                        }
                        
                    }
                    if(language === 'amharic'){
                        res.render("rental_form -Amh",{title: 'rental-form', naveprofile:rasu.profilepicture, displayer: displayer.length});
                    }
                    else{
                        res.render("rental_form",{title: 'rental-form', naveprofile:rasu.profilepicture, displayer: displayer.length});
                    }
                   
                }
               
            })
       
       })
       .catch(e =>{
           console.log(e);
       })
   }
   else{
     res.render("rental_form",{title: 'rental-form', naveprofile:'', displayer: 0});
   }
  
    
}

module.exports.get_index = (req,res) =>{
   
     let language ;
     const token = req.cookies.jwt;
     let user_id;
     if(token){
        jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                user_id = '';
            } else{
             
                user_id = decodedToken.id;
               
            }
        })
        console.log('##########################################################################')
        console.log(user_id)
        User.findById(user_id)
       
    .then((result)=>{
        console.log(result)
        Savedhome.find()
        .then((cart_logger)=>{
            total_length = cart_logger.length;
            console.log(total_length)
            console.log('#########################################3')
            displayer = [];
            for(let j=0 ; j<total_length; j++){
                if(user_id === cart_logger[j].uid){
                    displayer.push(cart_logger[j]);
                }
            }
            Language.find()
            .then((roba)=>{
                if(roba.length > 0){
                    for(let i = 0; i< roba.length; i++){
                        if(roba[i].uid === user_id){
                            language = roba[i].language;
                            break;
                        }
                        else{
                            if(i === roba.length-1){
                                language = 'english';
                                break;
                            }
                        }
                        
                    }
                    Rating.find()
                    .then(ratings =>{
                       let len = ratings.length;
                       let popular_homes = [];
                       for(let i=0 ; i<len ; i++){
                        if(ratings[i].rating_number >= 4 ){
                            popular_homes.push(ratings[i].home_id);
                        }
                       }
                       
                       Rental.find()
                       .then((rentals) =>{
                        let popular_houses = [];
                        
                        for(let i = 0 ; i<len ; i++){
                           
                            for(let j=0 ; j<rentals.length ; j++){
                                if(popular_homes[i] === rentals[j].id){
                                    popular_houses.push(rentals[j]);
                                }
                            }
                        }
                       
                        console.log(result)
                        if(language === 'amharic'){
                            res.render("index -Amh",{title: 'home', naveprofile: result.profilepicture, displayer: displayer.length, popular_houses});
                        }
                        else{
                            res.render("index",{title: 'home', naveprofile: result.profilepicture, displayer: displayer.length, popular_houses});
                        }
                       })
                       .then(e=> {

                       })
                    })
                    .then(e=> {

                    })
                }
               
            })
           
            .catch(e =>{

            });   
        })
        .catch(e=>{

        });
       
    })
    .catch(e =>{
       
    })
    }
    else{
        Rating.find()
        .then(ratings =>{
           let len = ratings.length;
           let popular_homes = [];
           for(let i=0 ; i<len ; i++){
            if(ratings[i].rating_number >= 4 ){
                popular_homes.push(ratings[i].home_id);
            }
           }
           
           Rental.find()
           .then((rentals) =>{
            let popular_houses = [];
            
            for(let i = 0 ; i<len ; i++){
               
                for(let j=0 ; j<rentals.length ; j++){
                    if(popular_homes[i] === rentals[j].id){
                        popular_houses.push(rentals[j]);
                    }
                }
            }
            console.log(popular_homes)
            console.log(popular_houses)
            
                res.render("index",{title: 'home', naveprofile: '', popular_houses});
           })
           .then(e=> {

           })
        })
        .then(e=> {

        })
        
    }
}
// module.exports.get_profile = (req,res) =>{
//     res.render("profile",{title: 'profile'});
// }
module.exports.not_found = (req,res) =>{
    res.status(404).render("404",{title: '404'});
}

