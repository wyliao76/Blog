// load model
const Post = require('../models/post')
const User = require('../models/user')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')


// get index
exports.index = async (req, res)=>{
  try {
    let posts = await Post.find({})
    if (!posts) {
      return res.status(404).send('No posts!')
    } else {
      res.render('index', {
        posts: posts,
      })
    }
  } catch (err) {
    res.send(err)
  }
}

// get create post
exports.post_create_get = async (req, res)=>{
  try {
    res.render('post_create', {
      title:'Create a post'
    })
  } catch (err) {
    res.send(err)
  }
}

// post create post
exports.post_ceate_post = [
body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
body('body', 'body must not be empty.').isLength({ min: 1 }).trim(),
sanitizeBody('*').trim().escape(),
 async (req, res, next)=>{
  let errors = validationResult(req)
  let post = await new Post({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body,
    date: new Date(),
  })

  if (!errors.isEmpty()) {
    res.render('post_create', {post:post, errors: errors.array()})
  } else {
  try {
    await post.save()
    req.flash('success', 'Create post successful!')
    res.status(200).redirect('/')
  } catch (err) {
    res.json({err:err.message})
  }
}
}]

// get post
exports.post = async (req, res)=>{
  try {
    let post = await Post.findOne({_id:req.params.id})
    if (!post) {
      return res.status(404).send('No posts!')
    } else {
      res.render('post', {
        post: post
      })
    }
  } catch (err) {
    res.send(err)
  }
}

// get edit post
exports.post_edit_get = async (req, res)=>{
  try {
    let post = await Post.findOne({_id:req.params.id})
    if (!post) {
      return res.status(404).send('No posts!')
  } else {
    res.render('post_edit', {
      title:'Edit this post:',
      post: post
    })
  }
} catch (err) {
  res.send(err)
  }
}

// post edit post
exports.post_edit_post = [
body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
body('body', 'body must not be empty.').isLength({ min: 1 }).trim(),
sanitizeBody('*').trim().escape(),
async (req, res, next)=>{
  let errors = validationResult(req);
  let post = new Post({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body,
    date: new Date(),
    _id: req.params.id,
  })
  if (!errors.isEmpty()) {
      res.render('post_edit', {post:post, errors: errors.array()})
    } else {
  try {
    await Post.findOneAndUpdate({_id:req.params.id}, post)
    req.flash('success', 'Update post successful!')
    res.status(201).redirect('/')
  } catch (err) {
    res.send(err)
  }
}
}]

// get delete post
exports.post_delete_get = async (req, res)=>{
  try {
    let post = await Post.findOne({_id:req.params.id})
    res.render('post_delete', {
      post: post,
    })
  } catch (err) {
    res.send(err)
  }
}

// post delete post
exports.post_delete_post = async (req, res)=>{
  try {
    await Post.findOneAndDelete({_id:req.params.id})
    req.flash('success', 'Post deleted!')
    res.status(200).redirect('/')
  } catch (err) {
    res.send(err)
  }
}


// API index
exports.posts = async (req, res) => {
  try {
    let posts = await Post.find({})
    if (!posts) {
      return res.status(404).send('No posts!')
    }
    res.send(posts)
  } catch (err) {
    res.send(err)
  }
}


// API get post
exports.detail = async (req, res) => {
  try {
    let post = await Post.findOne({_id:req.params.id})
    if (!post) {
      return res.status(404).send('No posts!')
    }
    res.send(post)
  } catch (err) {
    res.send(err)
  }
}
