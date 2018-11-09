const User = require('../models/user')
const UserOauth = require('../models/user_oauth')
const bcrypt = require('bcryptjs')
const Keys = require('./Keys')
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy

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

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser( async (id, done) => {
  let user = await User.findById(id)
  if (!user) {
    user = await UserOauth.findById(id)
    done(null, user)
  } else {
    done(null, user)
  }
})

module.exports = passport
