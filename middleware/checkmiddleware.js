const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        if(
            file.fieldname === "pic1" ||
            file.fieldname === "pic2" ||
            file.fieldname === "pic3" ||
            file.fieldname === "pic4" 
            ){
                cb(null,'assets/checkphoto/');
            }
        else if(
            file.fieldname === "profilepicture"
        ){
            cb(null, 'assets/profile_picture/');
        }
        else if(file.fieldname === "vedio"){
            cb(null,'assets/checkphoto/');
        }    
    },
    filename: (req,file,cb) => {
        let name =  Date.now() + path.extname(file.originalname);
        cb(null,name);
    }
});

var check = multer({
    storage:storage,
    fileFilter: (req,file,cb) =>{
        // if(
        //     file.mimetype == "image/png" ||
        //     file.mimetype == "image/jpg" ||
        //     file.mimetype == "image/jpeg" ||
        //     file.mimetype == "vedio/mp4"  ||
        //     file.mimetype ==""
        // ){
        //     cb(null,true);
        // }
        // else{
        //     cb(null,false);
        // }
        cb(null,true);

    },
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
})

module.exports = check;