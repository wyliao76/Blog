const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const bcrypt = require('bcryptjs')
const passport = require('passport')

// load model
let User = require('../models/user')

// load controller
let postController = require('../controllers/postController')

// get register
router.get('/register', (req, res) => {
  res.render('register')
})

// post register
router.post('/register', [
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  body('email', 'Email must not be empty.').isEmail().trim(),
  body('password', 'Password must not be empty.').isLength({ min: 6 }).trim(),
  body('password2', 'Confirm password must not be empty.').isLength({ min: 6 }).trim()
  .custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Confirm password does not match password')
  } else {
    return value
  }
}),
  body('firstName', 'First name must not be empty.').isLength({ min: 1 }).trim(),
  body('lastName', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('*').trim().escape()
], async (req, res) => {

  let errors = validationResult(req)
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  })
  if (!errors.isEmpty()) {
    return res.render('register', {user:user, errors:errors.array()})
  } else {
    try {
      let email = await User.findOne({email:req.body.email})
      if (email) {return res.send("This email has been used.")}

      let username = await User.findOne({username:req.body.username})
      if (username) {return res.send("This username has been used.")}

      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(user.password, salt)
      user.password = await hash
      await user.save()
      req.flash('success','You are now registered and can log in')
      res.redirect('/user/login')
    } catch (err) {
      res.send(err)
    }
  }
})

// login
router.get('/login', (req, res) => {
  res.render('login')
})

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/user/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You are logged out')
  res.redirect('/user/login')
})

router.get('/profile', postController.isAuthed, async (req, res) => {
  try {
    res.render('profile', {user:req.user})
  } catch (err) {
    res.send(err)
  }
})

// check if user is authenticated
router.get('/checkauth', function(req,res,next){
   if(req.user)
      return next();
   else
      return res.status(401).json({
        error: 'User not authenticated'
      })

}, function(req, res){
    res.status(200).json({
        status: 'Login successful!'
    });
});

module.exports = router
