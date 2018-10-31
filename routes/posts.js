const express = require('express')
const router = express.Router()

// load model
let Post = require('../models/post')

// load controller
let postController = require('../controllers/postController')

// get index
router.get('/', postController.index)

// create post
router.route('/post/create')
.get(postController.post_create_get)
.post(postController.post_ceate_post)

// get a single post
router.get('/post/:id', postController.post)

// edit post
router.route('/post/edit/:id')
.get(postController.post_edit_get)
.post(postController.post_edit_post)

// get delete post
router.route('/post/delete/:id')
.get(postController.post_delete_get)
.post(postController.post_delete_post)

// API
router.route('/api/post')
.get(postController.posts)
.post(postController.post_ceate_post)

// API post
router.route('/api/post/:id')
.get(postController.detail)
.put(postController.post_edit_post)
.delete(postController.post_delete_post)

module.exports = router
