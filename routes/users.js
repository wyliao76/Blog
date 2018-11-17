const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const multer  = require('multer')
const multerS3  = require('multer-s3')
const aws = require('aws-sdk')
const Keys = require('../config/keys')
const path = require('path')

// load model
let User = require('../models/user')
let UserOauth = require('../models/user_oauth')

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
  body('password', 'Password should be at least 8 char or digits.').isLength({ min: 8 }).trim(),
  body('password2', 'Confirm password should be at least 8 char or digits.').trim()
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
      if (email) {
        return res.send("This email has been used.")
      }

      let username = await User.findOne({username:req.body.username})
      if (username) {
        return res.send("This username has been used.")
      }
      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(user.password, salt)
      user.password = hash
      user.save()
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
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/user/login',
    failureFlash: true
  })(req, res, next)
})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You are logged out')
  res.redirect('/user/login')
})

// get profile
router.get('/profile', postController.isAuthed, (req, res) => {
  try {
    res.render('profile', {user:req.user})
  } catch (err) {
    res.send(err)
  }
})

// get update profile
router.get('/profile/update', postController.isAuthed, (req, res) => {
  try {
    res.render('profile_update', {user:req.user})
  } catch (err) {
    res.send(err)
  }
})

// post update profile
router.post('/profile/update',[
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  body('email', 'Email must not be empty.').isEmail().trim(),
  body('firstName', 'First name must not be empty.').isLength({ min: 1 }).trim(),
  body('lastName', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
], async (req, res) => {
  try {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('profile_update', {user:user, errors:errors.array()})
    } else {
      let user = await User.findOne({_id:req.user.id})
      if (!user) {
        user = await UserOauth.findOne({_id:req.user.id})
      }
      user.username = req.body.username
      user.email = req.body.email
      user.firstName = req.body.firstName
      user.lastName = req.body.lastName
      user.save()
      req.flash('success', 'Profile updated!')
      res.redirect('/user/profile')
    }
  } catch (err) {
    res.send(err)
  }
})

// get portrait update
router.get('/profile/portrait_update', postController.isAuthed, (req, res) => {
  try {
    res.render('portrait_update', {user:req.user})
  } catch (err) {
    res.send(err)
  }
})

// diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/upload')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.originalname.split('.')[1])
  }
})
const uploadDisk = multer({ storage: storage })

// AWS S3
aws.config.update({
    accessKeyId: Keys.S3accessKeyId,
    secretAccessKey: Keys.S3secretAccessKey,
    region: 'ap-southeast-1',
    signatureVersion: 'v4',
})
const s3 = new aws.S3()

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'wyliao76-blog-bucket',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
      cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.originalname.split('.')[1])
    }
  })
})

// post portrait update
router.post('/profile/portrait_update', upload.single('portrait'), async (req, res) => {
  try {
    let user = await User.findOne({_id:req.user.id})
    if (!user) {
      user = await UserOauth.findOne({_id:req.user.id})
    }
    // user.portrait = path.join('/upload', req.file.filename)
    user.portrait = req.file.location
    user.save()
    req.flash('success', 'file uploaded!')
    res.redirect('/user/profile')
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
