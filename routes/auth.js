const express = require('express');
const router = express.Router();
const auth = require('../controllers/user');

//Auth GET routes

router.get('/signup', function(req, res) {
    let popup = {confPass:false,duplicateUser:false}
    res.render('signup',{popup:popup});   
});

router.get('/login', function(req, res) {
    let popup1 = {incorrectuser:false,incorrectpassword:false}
    res.render('login',{popup1:popup1});   
}); 

// Auth POST routes
router.post('/signup', auth.signup);
router.post('/login', auth.signin);
router.post('/signout', auth.signout);

module.exports = router;