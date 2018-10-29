const express = require('express')
const router = express.Router()

// load model
let Post = require('../models/post')

// index
router.get('/', (req, res) =>{
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


// detail page of a post
router.get('/posts/:id', (req, res) =>{
  res.send("under construction")
})


// get of create a post
router.get('/posts/create', (req, res) =>{
  res.send("under construction")
})


// post of create a post
router.post('/posts/create', (req, res) =>{
  res.send("under construction")
})


// get update a post
router.get('/posts/update/:id', (req, res) =>{
  res.send("under construction")
})


// post update a post
router.post('/posts/update/:id', (req, res) =>{
  res.send("under construction")
})


// get delete a post
router.get('/posts/delete/:id', (req, res) =>{
  res.send("under construction")
})


// post delete a post
router.post('/posts/delete/:id', (req, res) =>{
  res.send("under construction")
})

module.exports = router
