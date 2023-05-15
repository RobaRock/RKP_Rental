const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        if(
            file.fieldname === "profilepicture"
        ){
            cb(null, 'assets/profile_picture/');
        }    
    },
    filename: (req,file,cb) => {
        let name =  Date.now() + path.extname(file.originalname);
        cb(null,name);
    }
});

var upload = multer({
    storage:storage,
    fileFilter: (req,file,cb) =>{
        if(
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ){
            cb(null,true);
        }
        else{
            cb(null,false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
})

module.exports = upload;