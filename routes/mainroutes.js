const { Router } = require('express');
const {requireAuth} = require('../middleware/authMiddleware');
const maincontroller = require('../controler/maincontroler');
const upload = require('../middleware/upload');
const check = require('../middleware/checkmiddleware')

const router = Router();

router.get('/confirm_forgot_password/:id', maincontroller.get_confirm_forgot_password)

router.post('/forgot_password', maincontroller.post_forgot_password)

router.get('/forgot_password', maincontroller.get_forgot_password)

router.get('/voice_assistance', maincontroller.get_voice_assistance)

router.post('/rkp_dialoger', maincontroller.post_rkp_dialoger)

router.post('/check_photoes',check.fields([
    {
    name: 'pic1',
    maxCount: 1 
    },
    {
    name: 'pic2',
    maxCount: 1 
    },
    {
    name: 'pic3',
    maxCount: 1 
    },
    {
    name: 'pic4',
    maxCount: 1 
    },
    {
    name: 'vedio',
    maxCount: 1
    }
]), maincontroller.post_check_photoes);

router.post('/rkp_estimator', maincontroller.post_rkp_estimator);

router.post('/report', maincontroller.post_get_report);

// router.post('/upload-pp',upload.single('profilepicture') ,maincontroller.post_upload);

router.get('/rkp_estimator', maincontroller.get_rkp_estimator);

router.get('/', maincontroller.get_index);

router.post('/feedback', maincontroller.post_feedback);

router.get('/filter_index', maincontroller.post_filter_index);

router.post('/individual_house/:id',requireAuth, maincontroller.get_individual_house);

router.get('/log_in', maincontroller.get_log_in);

router.get('/register', maincontroller.get_register);

// router.get('/profile', requireAuth, maincontroller.get_profile );
router.get('/profile/:id', requireAuth, maincontroller.get_profile_id);

router.get('/posts/:id', requireAuth, maincontroller.get_posts);

router.post('/rating', requireAuth ,maincontroller.post_rating);

router.get('/about_us',maincontroller.get_about_us);

router.get("/contact_us",maincontroller.get_contact_us);

// router.post('/add-rental', upload.fields([
//     {
//     name: 'pic1',
//     maxCount: 1 
//     },
//     {
//     name: 'pic2',
//     maxCount: 1 
//     },
//     {
//     name: 'pic3',
//     maxCount: 1 
//     },
//     {
//     name: 'pic4',
//     maxCount: 1 
//     },
// ]), maincontroller.post_add_rental);

router.post('/payment', maincontroller.post_payment);

router.get('/success', maincontroller.get_success);

// router.get('/cancel', maincontroller.get_cancel);

router.post('/pay', maincontroller.post_pay);

router.post('/compare_homes', maincontroller.post_compare_homes);

router.get('/language_preference/:id', maincontroller.get_language_preference);

router.post('/filter_view', maincontroller.post_filter_view);

router.get('/chatbox', maincontroller.get_chatbox);

router.get('/chatbox/:id', maincontroller.get_specific_chatbox);

router.post('/change-post/:id',check.fields([
    {
    name: 'pic1',
    maxCount: 1 
    },
    {
    name: 'pic2',
    maxCount: 1 
    },
    {
    name: 'pic3',
    maxCount: 1 
    },
    {
    name: 'pic4',
    maxCount: 1 
    },
]) ,maincontroller.post_change_post);

router.post('/chatbox',maincontroller.post_chatbox);

router.post('/available_homes/:id', maincontroller.post_serched_data);

router.get('/saved-homes', maincontroller.get_savedhomes);

router.post('/savedhomes', maincontroller.post_savedhomes);

router.post('/delete_savedhome/:id', maincontroller.post_delete_savedhome);

router.get('/available_homes', maincontroller.get_available_homes);

router.get('/rental_form', requireAuth ,maincontroller.get_rental_form);



router.use(maincontroller.not_found);

module.exports = router;