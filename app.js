const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/nodeDB')
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

app.get('/', (req, res) => {
  Post.find({}, (err, posts) =>{
    if(err){
      console.log(err)
    } else {
      res.render('index', {
        posts: posts,
       })
    }
  })
})

// app.get('/', (req, res) => {
//   res.send('Home page')
// })

app.listen(3000, () => {
  console.log("Server running on port: " + 3000)})
