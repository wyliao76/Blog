let mongoose = require('mongoose')

// schema
let UserSchema = mongoose.Schema(
  {
    username: {type:String, required:true, max: 100},
    email: {type:String, required:true, max: 100},
    password: {type:String, required:true},
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    portrait: String,
  }
)

// export model
const User = module.exports = mongoose.model('User', UserSchema)
