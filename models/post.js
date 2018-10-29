let mongoose = require('mongoose')

// schema
let PostSchema = mongoose.Schema(
  {
    author: {type:String, required:true, max: 100},
    title: {type:String, required:true, max: 100},
    body: {type:String, required:true},
    date: {type: Date, }
  }
)

// export model
module.exports = mongoose.model('Post', PostSchema)
