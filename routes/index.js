var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Events = require('../models/Events.js');
var UpdatedEvents = require('../models/UpdatedEvents.js');
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
        'callbackURL'   : 'http://tigerevents.org/auth/google/callback'
    };

//local

// var googleAuth =
// {
//         'clientID'      : '1032678438442-rhvgkn5l7en4mmnv2t94jiamnndo4reb.apps.googleusercontent.com',
//         'clientSecret'  : 'J9QEdWZG2YMVuJkWw1BotaMu',
//         'callbackURL'   : 'http://localhost:3000/auth/google/callback'
//     };
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
       appUser.visits = appUser.visits + 1;
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
        // var auto = new AutoComplete({category: profile.emails[0].value});
        // auto.save(function(err, saved){
        //   if (err) return next(err);
        //   return done(null, false, {message: "Invalid _@princeton.edu address"});
        // });
        
        var newUser = new User();
        newUser.googleId.id = profile.id;
        newUser.googleId.token = token;
        newUser.googleId.name  = profile.displayName;
        newUser.lastTime = new Date();
        newUser.visits = 1;
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
  console.log("USER LOGGED IN" + req.user);
  res.render('index');
});

router.get('/user', isLoggedIn, function(req, res){
  console.log(req.user);
  res.send(req.user);
});

router.get('/myevents', isLoggedIn, function(req, res, next) {
  var cutOff = new Date().getTime();
  var query = Events.find({favoritedBy: req.user._id});
  query.find({eventUTC: {$gt: cutOff}});
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
    console.log("Grabbed events and returning");
    res.json(events);
  });
});

router.post('/favoriteEvent', isLoggedIn, function(req, res, next){
  var query = Events.findOne({_id: req.body._id});
  console.log("here");
  query.exec(function(err, eventf){
    var tags = eventf.favoritedBy;
    var isMarked = false;
    for (var i = 0; i < tags.length; i++){
      if (tags[i].equals(req.user._id)){
        isMarked = true;
        break;
      }
    }
    if (isMarked){
      res.json(eventf);
    }
    else {
      eventf.favoritedBy.push(req.user._id);
      eventf.popularity = eventf.popularity+1;
      eventf.save(function(err, savedEvent){
      if (err){console.log(err); return next(err)};
      console.log(savedEvent);
      res.json(savedEvent);
    });
    }
  });
})



router.get('/events', isLoggedIn, function(req, res, next) {
  console.log("got to events");
  var cutOff = new Date().getTime();
  console.log(moment(cutOff).format("YYYY-MM-DDTHH:mm:ssZ"));
  var upperCutoff = cutOff + 864000000;
  var preferences = [];
  console.log(cutOff);
  var query = Events.find({eventStartUTC: {$gt: cutOff, $lt: upperCutoff}});
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
    console.log("Grabbed events and returning");

    res.json(events);
  });
});


router.get('/myevents', isLoggedIn, function(req, res, next) {
  var cutOff = new Date().getTime();
  var query = Events.find({favoritedBy: req.user._id});
  query.find({eventUTC: {$gt: cutOff}});
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
    console.log("Grabbed events and returning");
    res.json(events);
  });
});


router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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


router.post('/removeEvent', isLoggedIn, function(req, res, next){
  console.log(req.body);
  var query = Events.findOne({"_id": req.body._id});
  query.exec(function(err, foundEvent){
    for (var i = 0; i < foundEvent.favoritedBy.length; i++){
      if (foundEvent.favoritedBy[i].equals(req.user._id)){
        foundEvent.favoritedBy.splice(i, 1);
        break;
      }
    }
    foundEvent.save(function(err, savedEvent){
      if (err) {console.log("DIDNT REMOVE EVENT FAVORITED BY USER"); return next(err);}
      res.json(200);
    });

  });
});

router.post('/events', isLoggedIn, function(req, res, next) {
  console.log("Adding a new event");
  console.log(req.user.googleId.email);
  req.body.creator = req.user.googleId.email;
  User.findById(req.user._id, function(err, appUser){
    if (appUser.numOfPosts > 50){
      res.json(204);
    }  
    if (appUser.postPermission){
      var newEvent = new Events(req.body);      
      newEvent.save(function(err, savedEvent){
        if (err){return next(err)};
        console.log("new event added" + savedEvent);
        savedEvent.save(function(err, savedEvent){
          if (err){console.log("NO SAVE EVENT"); return next(err);}
          appUser.numOfPosts = appUser.numOfPosts + 1;
          appUser.save(function(err, savedUser){
            if (err) {console.log("NO SAVE, YES PERMISS");return next(err);}
            res.json(savedEvent);
          });
        });
      });
    }
    else {
      var newEvent = new UpdatedEvents(req.body);
      newEvent.save(function(err, savedEvent){
        if (err){return next(err)};
        console.log("new event added" + savedEvent);
        savedEvent.save(function(err, savedEvent){
          if (err){console.log("NO SAVE EVENT"); return next(err);}
          appUser.numOfPosts = appUser.numOfPosts + 1;
          appUser.save(function(err, savedUser){
            if (err) {console.log("NO SAVE, YES PERMISS");return next(err);}
            res.json(savedEvent);
          });
        })
      });;
    }


  });
});

// eventsAdded: [],
//   eventPreferences: [],
//   googleCal: [],

//   var query = Events.findOne({_id: req.body._id});
//   console.log("here");
//   query.exec(function(err, eventf){
//     var tags = eventf.favoritedBy;
//     var isMarked = false;
//     for (var i = 0; i < tags.length; i++){
//       if (tags[i].equals(req.user._id)){
//         isMarked = true;
//         break;
//       }
//     }
//     if (isMarked){
//       res.json(eventf);
//     }
//     else {
//       eventf.favoritedBy.push(req.user._id);
//       eventf.popularity = eventf.popularity+1;
//       eventf.save(function(err, savedEvent){
//       if (err){console.log(err); return next(err)};
//       console.log(savedEvent);
//       res.json(savedEvent);
//     });
//     }


router.post('/addToCal', isLoggedIn, function(req, res, next) {
  var query = User.findOne({"_id": req.user._id});
  var isMarked = false;
  query.exec(function(err, foundUser){
    var newEvent = new Events(req.body);
    if (foundUser.googleCal){
      console.log("CHECKING GCAL");
      for (var i = 0; i < foundUser.googleCal.length; i++){
        console.log("FOUNDUSER ID IS" + foundUser.googleCal[i]);
        console.log("EVENT ID IS"+ newEvent._id);
        if (foundUser.googleCal[i].equals(newEvent._id)){
          isMarked = true;
          break;
        }
      }
      if (isMarked){
        res.json(204);
      }
      else {
        console.log("got to eventBody");
        var eventBody = {
          'status':'confirmed',
          'summary': newEvent.eventName,
          'location': newEvent.eventHost,
          'description': newEvent.eventDescription,
          'start': {
            'dateTime': moment(new Date(newEvent.eventStartUTC)).format("YYYY-MM-DDTHH:mm:ssZ"),
            'timeZone': "America/New_York"
          },
          'end': {
            'dateTime': moment(new Date(newEvent.eventEndUTC)).format("YYYY-MM-DDTHH:mm:ssZ"),
            'timeZone': "America/New_York"
          },
          'attendees': [
          {
            'email': req.user.googleId.email,
            'responseStatus': 'needsAction'
          }
          ]
        };
        var google_calendar = new googleCal.GoogleCalendar(req.user.googleId.token);
        google_calendar.events.insert(req.user.googleId.email, eventBody, function(err, response){

          if (!err){
            console.log("ADDED TO GCAL");
            foundUser.googleCal.push(newEvent._id);
            foundUser.save(function(err, savedUser){         
              res.send(200, response);
            });

          }
          else {
            console.log("DIDNT ADD TO GCAL");
            res.send(400, err);
          }
        });
      }
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
