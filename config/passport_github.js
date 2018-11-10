const UserOauth = require('../models/user_oauth')
const Keys = require('./Keys')
const passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy


passport.use(new GitHubStrategy({
    clientID: Keys.GITHUB_CLIENT_ID,
    clientSecret: Keys.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserOauth.findOne({ userId: profile.id })
      if (user) {
        done(null, user)
      } else {
        let user = new UserOauth({
          userId: profile.id,
          username: profile.username,
          portrait: profile._json.avatar_url,
        })
        user.save()
        done(null, user)
      }
    } catch (err) {
      console.log(err)
    }
  }
))

module.exports = passport
