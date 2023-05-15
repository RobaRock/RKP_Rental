const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'please enter a name']
    },
    phonenumber:{
        type: String,
        required: [true, 'please enter a phonenumber'],
        unique: true
    },
    email:{
        type: String,
        required: [true, 'please enter an email'],
        unique: true,
        lowercase: true,
        validate: [ isEmail, 'please enter a valid email'],
    },
    
    password:{
        type: String,
        required: [true, 'please enter a password'],
        minlength: [6, 'minimum length is 6'],
        
    },
    confirm:{
        type: String,
        required: [true, 'enter a password'],
        minlength: [6, 'minimum length is 6'],
        validate: []
    },
   
    landlordd:{
        type: Boolean,
    },
    profilepicture:{
        type: String,
        default: ''
    },
    blocked:{
        type: String,
        default: '',
    },
    isEmailConfirmed:{
        type: Boolean, 
        default: false 
    },
    isPhoneConfirmed:{
        type: Boolean, 
        default: false 
    },
    userPhoto:{
        type: String,
        default: ''
    }
},{timestamps: true});

    // fire a function before doc saved to db
 
        userSchema.pre('save', async function(next) {
            console.log(this.password);
            if(!containsSpecialChars(this.password)){
                const salt = await bcrypt.genSalt();
                this.password = await bcrypt.hash(this.password, salt);
            }
            next();
        });
    
    //creating a static login function
    userSchema.statics.log_in = async function(email,password){
        const user = await this.findOne({email});
        console.log('-------------------------------------------------------------')
        console.log(user);
        console.log('-------------------------------------------------------------')
        if(user ){
            if(user.isEmailConfirmed){
                if(user.blocked === "false"){
                    const auth = await bcrypt.compare(password, user.password);
               if(auth){
                   return user;
               } throw Error('incorrect password');
               } throw Error('blocked account')
            }throw Error('Email Not Confirmed')
            
           

        } throw Error('incorrect email');

    }

    //checking special character
    function containsSpecialChars(str) {
        if(str.length > 40){
            return true;
        }
        else{
            return false;
        }
      }

    //creating user module and exporting
    const User = mongoose.model('User', userSchema);
    module.exports = User;