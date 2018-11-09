let mongoose = require('mongoose')

// schema
let UserOAuthSchema = mongoose.Schema(
  {
    userId: String,
    username: {type:String, max: 100},
    email: {type:String, max: 100},
    firstName: String,
    lastName: String,
    portrait: String,
  }
)

// export model
module.exports = mongoose.model('UserOAuth', UserOAuthSchema)
