const jwt = require('jsonwebtoken');
const User = require('../module/user');
// const Savedhome = require('../module/saved_home');
const maincontroler = require('../controler/maincontroler');




const requireAuth = (req,res,next) =>{

    const token = req.cookies.jwt;
    
    // check whether json web token is exist and is verified
    if(token){
        jwt.verify(token, 'net ninja secret', (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/'); 
            } else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.send('<script>alert("to access the page log in to the Website"); window.location.href = "/"; </script>');
    }
}

    //check current user
    const checkUser = (req,res,next)=>{
        const token = req.cookies.jwt;

        if(token){
            jwt.verify(token, 'net ninja secret', async(err,decodedToken)=>{
                if(err){
                    console.log(err.message);
                    res.locals.user = null;
                    next();
                } else{
                    console.log(decodedToken);
                    let user = await User.findById(decodedToken.id)
                    res.locals.user = user;
                    next();
                }
            })
        }else{
            res.locals.user = null;
            next();
        }
    }

    module.exports = {requireAuth, checkUser};