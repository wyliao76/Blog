const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const postRouter = require('./routes/posts');

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
let Post = require('./models/post')

// Load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// load bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// static
app.use(express.static(path.join(__dirname, 'public')))

// load router
app.use('/', postRouter)

const port = 3000

app.listen(port, () => {
  console.log("Server running on port: " + port)})
