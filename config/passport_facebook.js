const UserOauth = require('../models/user_oauth')
const Keys = require('./Keys')
const passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy

// API is not activate due to the absent of privacy policy url facebook required
passport.use(new FacebookStrategy({
    clientID: Keys.FACEBOOK_APP_ID,
    clientSecret: Keys.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile)
      // let user = await UserOauth.findOne({ userId: profile.id })
      // if (user) {
      //   done(null, user)
      // } else {
      //   let user = new UserOauth({
      //     userId: profile.id,
      //     username: profile.displayName,
      //     email: profile.emails[0].value,
      //     firstName: profile.name.givenName,
      //     lastName: profile.name.familyName,
      //     portrait: profile._json.image.url,
      //   })
      //   user.save()
      //   done(null, user)
      // }
    } catch (err) {
      console.log(err)
    }
  }
))

module.exports = passport
