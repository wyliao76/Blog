// load model
const Post = require('../models/post')
const User = require('../models/user')
const UserOauth = require('../models/user_oauth')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')


// get index
exports.index = async (req, res) => {
  try {
    let posts = await Post.find({})
    if (posts.length == 0) {
      req.flash('danger', 'There is no posts!')
      res.render('index', {
        posts: posts,
      })
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
exports.post_create_get = async (req, res) => {
  try {
    res.render('post_create')
  } catch (err) {
    res.send(err)
  }
}

// post create post
exports.post_ceate_post = [
body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
body('body', 'body must not be empty.').isLength({ min: 1 }).trim(),

// I don't know how to decode the sanitized data
// sanitizeBody('*').escape(),
async (req, res) => {
  try {
    let errors = await validationResult(req)
    let post = new Post({
      title: req.body.title,
      author: req.user._id,
      body: req.body.body,
      date: new Date()
      })
    if (!errors.isEmpty()) {
      return res.render('post_create', {post:post, errors: errors.array()})
    } else {
        post.save()
        req.flash('success', 'Create post successful!')
        res.status(200).redirect('/')
      }
  } catch (err) {
    console.log(err)
  }
}]

// get a single post
exports.post = async (req, res) => {
  try {
    let post = await Post.findOne({_id:req.params.id})
    let author = await User.findOne({_id:post.author})
    if (!author) {
      author = await UserOauth.findOne({_id:post.author})
    }
    res.render('post', {
      post: post,
      author: author.username,
      })
    } catch (err) {
      res.send(err)
    }
  }

// get edit post
exports.post_edit_get = async (req, res) => {
  try {
    let post = await Post.findOne({_id:req.params.id})
    if (post.author != req.user._id){
      req.flash('danger', 'Hey you cannot go there!')
      return res.redirect('/')
    } else {
    res.render('post_edit', {
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
body('body', 'body must not be empty.').isLength({ min: 1 }).trim(),

// I don't know how to decode the sanitized data
// sanitizeBody('*').escape(),
async (req, res) => {
  try {
    let errors = await validationResult(req);
    let post = new Post({
      title: req.body.title,
      author: req.body.author,
      body: req.body.body,
      date: new Date(),
      _id: req.params.id,
    })
    if (!errors.isEmpty()) {
        res.render('post_edit', {post:post, user:req.user, errors: errors.array()})
      } else {
      await Post.findOneAndUpdate({_id:req.params.id}, post)
      req.flash('success', 'Update post successful!')
      res.redirect('/')
    }
  } catch (err) {
    res.send(err)
  }
}]

// get delete post
exports.post_delete_get = async (req, res) => {
  try {
    let post = await Post.findOne({_id:req.params.id})
    if (post.author != req.user._id){
      req.flash('danger', 'Hey you cannot go there!')
      return res.redirect('/')
    }
    res.render('post_delete', {
      post: post,
    })
  } catch (err) {
    res.send(err)
  }
}

// post delete post
exports.post_delete_post = async (req, res) => {
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
    if (posts.length == 0) {
      return res.status(404).send('No posts!')
    }
    res.json(posts)
  } catch (err) {
    res.send(err)
  }
}


// API get post
exports.detail = async (req, res) => {
  try {
    let post = await Post.findOne({_id:req.params.id})
    res.json(post)
  } catch (err) {
    res.send(err)
  }
}

exports.isAuthed = (req, res, next) => {
  if (req.isAuthenticated()){
    return next()
  } else {
    req.flash('danger', 'Login required.')
    res.redirect('/user/login')
  }
}
