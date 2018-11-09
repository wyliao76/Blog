const express = require('express')
const router = express.Router()
const passportGoogle = require('../config/passport_google')
const passportFacebook = require('../config/passport_facebook')


// login with Google
router.get('/google', passportGoogle.authenticate('google', {
  scope:['profile']
}))

// Google callback
router.get('/google/callback', passportGoogle.authenticate('google', {
   failureRedirect: '/user/login' }), (req, res) => {
  res.redirect('/')
})

// login with Facebook
router.get('/facebook', passportFacebook.authenticate('facebook', {
  scope:['profile']
}))

// Facebook callback
router.get('/facebook/callback', passportFacebook.authenticate('facebook', {
   failureRedirect: '/user/login' }), (req, res) => {
  res.redirect('/')
})


function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}


module.exports = router
