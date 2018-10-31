// load model
let Post = require('../models/post')

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
exports.post_ceate_post = async (req, res)=>{
  let post = new Post({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body,
    date: new Date(),
  })
  try {
    await post.save()
    res.status(200).redirect('/')
  } catch (err) {
    res.send(err)
  }
}

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
exports.post_edit_post = async (req, res)=>{
  let post = new Post({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body,
    date: new Date(),
    _id: req.params.id,
  })
  try {
    await Post.findOneAndUpdate({_id:req.params.id}, post)
    res.status(201).redirect('/')
  } catch (err) {
    res.send(err)
  }
}

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
