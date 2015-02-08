var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Events = require('../models/Events.js');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var request = require('request');



// PASSPORT AUTHENTICATION
//------------------------------------------------------------------------
passport.serializeUser(function(user, done){
  done(null, user._id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, appUser){
    done(err, appUser);
  });
});

var googleAuth =
{
  'clientID'      : '375009401841-n8lbs9fqtom68hbh9oo1dprpj7l3gq0f.apps.googleusercontent.com',
  'clientSecret'  : 'lcFBv3AtdTrc_lRyyj4EZ8-I',
  'callbackURL'   : 'http://localhost:3000/auth/google/callback'
};

passport.use(new GoogleStrategy({
  clientID: googleAuth.clientID,
  clientSecret: googleAuth.clientSecret,
  callbackURL: googleAuth.callbackURL
}, function(token, refreshToken, params, profile, done){
  process.nextTick(function(){
    User.findOne({'googleId.id': profile.id}, function(err, appUser){
      if (err) return done(err);
      if (appUser){
       appUser.googleId.token = token;
       appUser.googleId.refreshToken = refreshToken;
       appUser.lastTime = new Date();
       return done(null, appUser);
      } 
      else {
      var email = profile.emails[0].value;
      var n = email.search(/@princeton.edu$/);
      console.log(email);
      console.log(n);
      }
      if (n < 0)
      {
        return done(null, false, {message: "Invalid _@princeton.edu address"});
      }
      else 
      {
        var newUser = new User();
        newUser.googleId.id = profile.id;
        newUser.googleId.token = token;
        newUser.googleId.refreshToken = refreshToken;
        newUser.googleId.name  = profile.displayName;
        newUser.lastTime = new Date();
        newUser.googleId.email = profile.emails[0].value;
        newUser.save(function(err){
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  });
}));


//-----------------------------------------------------------------------------------------------------------

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res){
  res.render('home');
});

router.get('/events', function(req, res, next) {
    var cutOff = new Date().getTime();
  Events.find({eventUTC: {$gt: cutOff}}, function(err, events){
    res.json(events);
  });
});

router.post('/events', function(req, res, next) {
  var newEvent = new Events(req.body);
  newEvent.save(function(err, savedEvent){
    if (err){return next(err)};
      res.json(savedEvent);
  });
});

/* Google Login routes. */
router.get('/auth/google', passport.authenticate('google', {
  scope:['profile', 'email'],
  approvalPrompt: 'force'}));

router.get('/auth/google/callback',passport.authenticate('google',{
  failureRedirect: '/index'}), function(req, res){
  res.redirect('/#/home');
});


module.exports = router;
