const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const postRouter = require('./routes/posts');
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const flash = require('connect-flash-plus')
const session = require('express-session')

mongoose.connect('mongodb://127.0.0.1/nodeDB', { useNewUrlParser: true })
let db = mongoose.connection

// check connection
db.once('open', () => {
  console.log('connect successful.')
})

// check error
db.on('error', console.error.bind(console, 'MongoDB connection failed:'));

// init app
const app = express();

// load model
const Post = require('./models/post')

// Load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// load bodyParser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// static
app.use(express.static(path.join(__dirname, 'public')))

// session
app.use(session({
  secret: 'ThISAsECRet',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 },
}))

// flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// load router
app.use('/', postRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log("Server running on port: " + port)})
