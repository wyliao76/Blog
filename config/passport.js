const User = require('../models/user')
const bcrypt = require('bcryptjs')


var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

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
}

passport.serializeUser(function(user, done) {
   done(null, user.id);
 });

 passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
     done(err, user);
   });
 });
