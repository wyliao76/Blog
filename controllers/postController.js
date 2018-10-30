// load model
let Post = require('../models/post')

// get index
exports.index = (req, res, next)=>{
  Post.find({}, (err, posts) =>{
    if(err){
      console.log(err)
    } else {
      res.render('index', {
        posts: posts,
       })
     }
   })
 }

// get create post
exports.post_create_get = (req, res, next)=>{
  res.render('post_create', {
    title:'Create a post'
  })
}

// post create post
exports.post_ceate_post = (req, res, next)=>{
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
}

// get post
exports.post = (req, res, next)=>{
  Post.findById(req.params.id, (err, post)=>{
    if (err){
      console.log(err)
    } else {
      res.render('post', {
        post: post
      })
    }
  })
}

// get edit post
exports.post_edit_get = (req, res, next)=>{
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
}

// post edit post
exports.post_edit_post = (req, res, next)=>{
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
}

// get delete post
exports.post_delete_get = (req, res, next)=>{
  Post.findById(req.params.id, (err, post) =>{
    if (err) {
      console.log(err)
    } else {
      res.render('post_delete', {
        post: post,
      })
    }
  })
}

// post delete post
exports.post_delete_post = (req, res, next)=>{
  Post.findOneAndDelete({"_id":req.params.id}, (err)=>{
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
}
