const { Router } = require('express');
const authcontroller = require('../controler/authcontroller');
const router = Router();
const upload = require('../middleware/upload');



router.post('/upload-pp/:id', upload.single('profilepicture'), authcontroller.put_upload);

router.post('/sign_up', authcontroller.post_sign_up);

router.get('/confirm-email/:id', authcontroller.get_confirm_email)

router.get('/confirm-phone/:id', authcontroller.get_confirm_phone)

router.post('/log_in', authcontroller.post_log_in);

router.get('/log_out', authcontroller.get_log_out);

router.post('/register', authcontroller.post_register)

module.exports = router;