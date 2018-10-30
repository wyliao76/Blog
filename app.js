const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// const postsRouter = require('./routes/posts');

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

// app.use('/', postsRouter)


// index
app.get('/', (req, res) => {
  Post.find({}, (err, posts) =>{
    if (err){
      console.log(err)
    } else {
      res.render('index', {
        posts: posts,
      })
     }
   })
 })




// get request of creating post
app.get('/post/create', (req, res) =>{
  res.render('post_create', {
    title:'Create a post'
  })
})


// post request of creating post
app.post('/post/create', (req, res) =>{
  let post = new Post({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body,
    date: new Date(),
  })
  post.save((err)=>{
    if (err){
      console.log(err)
      return
    } else {
      res.redirect('/')
    }
  })
})


// get a single post
app.get('/post/:id', (req, res)=>{
  Post.findById(req.params.id, (err, post)=>{
    if (err){
      console.log(err)
    } else {
      res.render('post', {
        post: post
      })
    }
  })
})


// get request of editing post
app.get('/post/edit/:id', (req, res) =>{
  Post.findById(req.params.id, (err, post)=>{
    if (err){
      console.log(err)
    } else {
      res.render('post_edit', {
        title:'Edit this post:',
        post: post
      })
    }
  })
})


// post rquest of editing post
app.post('/post/edit/:id', (req, res) =>{
  let post = new Post({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body,
    date: new Date(),
    _id: req.params.id,
  })
  Post.findOneAndUpdate({"_id":req.params.id}, post, (err)=>{
    if (err){
      console.log(err)
      return
    } else {
      res.redirect('/')
    }
  })
})


// get delete post
app.get('/post/delete/:id', (req, res)=>{
  Post.findById(req.params.id, (err, post) =>{
    if (err) {
      console.log(err)
    } else {
      res.render('post_delete', {
        post: post,
      })
    }
  })
})


// post delete post
app.post('/post/delete/:id', (req, res)=>{
  Post.findOneAndDelete({"_id":req.params.id}, (err)=>{
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
})


const port = 3000

app.listen(port, () => {
  console.log("Server running on port: " + port)})
