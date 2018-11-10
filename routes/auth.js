const express = require('express')
const router = express.Router()
const passportGoogle = require('../config/passport_google')
const passportFacebook = require('../config/passport_facebook')
const passportGitHub = require('../config/passport_github')


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

// login with GitHub
router.get('/github', passportGitHub.authenticate('github', {
  scope:['profile']
}))

// GitHub callback
router.get('/github/callback', passportGitHub.authenticate('github', {
   failureRedirect: '/user/login' }), (req, res) => {
  res.redirect('/')
})

module.exports = router
