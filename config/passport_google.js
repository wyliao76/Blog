const UserOauth = require('../models/user_oauth')
const Keys = require('./keys')
const passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy


passport.use(new GoogleStrategy({
    clientID: Keys.GOOGLE_CLIENT_ID,
    clientSecret: Keys.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://polar-dawn-14216.herokuapp.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserOauth.findOne({ userId: profile.id })
      if (user) {
        done(null, user)
      } else {
        let user = new UserOauth({
          userId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          portrait: profile._json.image.url,
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
