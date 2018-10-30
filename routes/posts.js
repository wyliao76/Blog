const express = require('express')
const router = express.Router()

// load model
let Post = require('../models/post')

// load controller
let postController = require('../controllers/postController')

// get index
router.get('/', postController.index)

// get request of creating post
router.get('/post/create', postController.post_create_get)

// post request of creating post
router.post('/post/create', postController.post_ceate_post)

// get a single post
router.get('/post/:id', postController.post)

// get request of editing post
router.get('/post/edit/:id', postController.post_edit_get)

// post rquest of editing post
router.post('/post/edit/:id', postController.post_edit_post)

// get delete post
router.get('/post/delete/:id', postController.post_delete_get)

// post delete post
router.post('/post/delete/:id', postController.post_delete_post)

module.exports = router
