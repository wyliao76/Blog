const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const postRouter = require('./routes/posts')
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const RedisStore = require('connect-redis')(session)
const passport = require('passport')
const Keys = require('./config/keys')
const helmet = require('helmet')
const compression = require('compression')
require('dotenv').config()

mongoose.connect('mongodb://127.0.0.1/nodeDB', { useNewUrlParser: true })
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
let db = mongoose.connection

// check connection
db.once('open', () => {
  console.log('connect successful.')
})

// check error
db.on('error', console.error.bind(console, 'MongoDB connection failed:'));

// init app
const app = express()

app.use(helmet())
app.use(compression())

// load model
const Post = require('./models/post')
const User = require('./models/user')

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
  secret: Keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 10 * 60 * 1000},
  store: new MongoStore({mongooseConnection: db})
  // store: new RedisStore({host:'localhost', port:6379, client: Keys.REDIS_CLIENT})
}))

// flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Passport Config
require('./config/passport')
// load passport
app.use(passport.initialize())
app.use(passport.session())

app.get('*', (req, res, next) => {
  res.locals.user = req.user || ''
  next()
})

// load router
app.use('/', postRouter)
app.use('/user/', userRouter)
app.use('/auth/', authRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log("Server running on port: " + port)})
