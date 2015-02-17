var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Events = require('../models/Events.js');
var AutoComplete = require('../models/autoComplete.js');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleCal = require('google-calendar');
var request = require('request');
var moment = require('moment');




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
       appUser.save(function(err, savedUser){
        if (err) {console.log("FIRST ERROR");throw err;}
        console.log("The updated user is " + savedUser.googleId.token);
        return done(null, savedUser);
      });
     }
     else {
      var email = profile.emails[0].value;
      var n = email.search(/@princeton.edu$/);
      
      if (n < 0)
      {
        return done(null, false, {message: "Invalid _@princeton.edu address"});
      }
      else 
      {
        var newUser = new User();
        newUser.googleId.id = profile.id;
        newUser.googleId.token = token;
        newUser.googleId.name  = profile.displayName;
        newUser.lastTime = new Date();
        newUser.googleId.refreshToken = refreshToken;
        newUser.googleId.email = profile.emails[0].value;
      //newUser.googleCal.push(google_calendar);
      newUser.save(function(err){
        if (err) throw err;
        return done(null, newUser);
      });
    }
  }
});
});
}));


//-----------------------------------------------------------------------------------------------------------

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'Express' });
});

router.get('/autocomplete', function(req, res) {
  var searchItem = req.query.q;
  AutoComplete.find({}).select("category").lean().exec(function(err, suggestions){
    return res.json(suggestions);
  });

});

router.get('/TigerEvents', isLoggedIn, function(req, res){
  console.log(req.user);
  res.render('index');
});

router.get('/events', isLoggedIn, function(req, res, next) {
  console.log("here");
  var cutOff = new Date().getTime();
  console.log(moment(cutOff).format("YYYY-MM-DDTHH:mm:ssZ"));
  var upperCutoff = cutOff + 864000000;
  var preferences = [];
  console.log(cutOff);
  var query = Events.find({eventUTC: {$gt: cutOff, $lt: upperCutoff}});
  /*if (req.user.eventPreferences.length > 0){
    var userPrefs = req.user.eventPreferences;
    console.log("grabbinb preferences!");
    console.log(userPrefs);
    for (var i = 0; i< userPrefs.length; i++){
      if (userPrefs[i].isPref){
        preferences.push(userPrefs[i].text);
      }
    }
    query.find({tags: {$in: preferences}});
  }*/
  query.sort({eventStartUTC: 'asc'});
  query.exec(function(err, events){
    res.json(events);
  });
});

router.post('/autocomplete', function(req, res, next) {
  var newSuggestion = new AutoComplete(req.body);
  console.log("req.body");
  newSuggestion.save(function(err, suggestion){
    if (err){console.log(err);return next(err)};
    console.log(suggestion);
    res.json(suggestion);
  });
});



/*router.post('/userprefs', isLoggedIn, function(req, res, next) {
  req.user.eventPreferences = req.body;
  req.user.save(function(err, savedUser){
    console.log(savedUser);
    if (err) return next(err);
    console.log("Before relogin" + req.session.passport.user.eventPreferences);
    req.login(savedUser, function(err)
    {
      if (err) return next(err);
      console.log("After relogin: " + req.session.passport.user.eventPreferences);
      res.send(200);
    });
  })
});*/

router.post('/events', isLoggedIn, function(req, res, next) {
  var newEvent = new Events(req.body);
  newEvent.save(function(err, savedEvent){
    if (err){return next(err)};
    res.json(savedEvent);
  });
});

router.post('/addToCal', isLoggedIn, function(req, res, next) {
    var eventBody = {
    'status':'confirmed',
    'summary': "Test summary of event",
    'location': "Dod basement",
    'description': "COME BY AND HAVE A LOT OF FUN DESCRIPTION",
    'start': {
      'dateTime': moment(new Date(1424484000000)).format("YYYY-MM-DDTHH:mm:ssZ"),
      'timeZone': "America/New_York"
    },
    'end': {
      'dateTime': moment(new Date(1424491200000)).format("YYYY-MM-DDTHH:mm:ssZ"),
      'timeZone': "America/New_York"
    },
    'attendees': [
        {
          'email': req.user.googleId.email,
          'responseStatus': 'needsAction'
        }
    ]
  };
  console.log("TOKEN IS" + req.user.googleId.token);
  var google_calendar = new googleCal.GoogleCalendar(req.user.googleId.token);
  google_calendar.events.insert(req.user.googleId.email, eventBody, function(err, response){
    console.log("Google response:", err, response);

    if (!err){
      res.send(200, response);
    }
    else {
      res.send(400, err);
    }
  });
});
/* Google Login routes. */
router.get('/auth/google', passport.authenticate('google', {
  scope:['profile', 'email',"https://www.googleapis.com/auth/calendar"]})); //add approvalPrompt: 'force' for offline

router.get('/auth/google/callback',passport.authenticate('google',{
  failureRedirect: '/index'}), function(req, res){
  res.redirect('/TigerEvents');
});

function isLoggedIn(req, res, next) {

  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};


module.exports = router;
