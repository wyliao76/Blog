const User = require('../models/user')
const bcrypt = require('bcryptjs')
const Keys = require('./Keys')
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

module.exports = function(passport){
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        bcrypt.compare(password, user.password, function(err, isMatch){
          if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Incorrect username or password'});
        }
      })
      });
    }
  ));

  passport.use(new GoogleStrategy({
      clientID: Keys.GOOGLE_CLIENT_ID,
      clientSecret: Keys.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
         User.findOrCreate({ googleId: profile.id }, function (err, user) {
           return done(err, user);
         });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
