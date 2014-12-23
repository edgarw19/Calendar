var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Note = require('../models/Notes.js');
var Friend = require('../models/Friends.js');
var User = mongoose.model('UserModel');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var PocketStrategy = require('passport-pocket');
var request = require('request');
var nodemailer = require('nodemailer');
var cronJob = require('cron').CronJob;
var job = new cronJob('20 * * * * *', function(){
  console.log('IT"S WORKING');
}, null, true);
// var mailgunKeys = {
//   apiKey: key-4c65ef91a6080fd82f50c2cda6159e14,
//   domain:
// }
var mailgun = require('mailgun-js')({apiKey:'key-4c65ef91a6080fd82f50c2cda6159e14'});
var data ={
  from: 'inTouch',
  to: 'edgarallenpoed@gmail.com',
  subject: 'Hello',
  text:' Testing some mailgun awesomeness!'
};
console.log("mailgun");
mailgun.messages().send(data, function(error, body){
  console.log("CAME HERE");
  console.log(body);
  console.log(error);
});
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: 'intouch.novv@gmail.com',
    pass: 'intouch123'
  }
});
passport.serializeUser(function(user, done){
    console.log(user);
        done(null, user._id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, appUser){
            done(err, appUser);
        });
});

var pocketParameters = {
   consumerKey: '35958-6423d13203b2c52fb2a17590',
  callbackURL : 'http://localhost:3000/auth/pocket/callback'
};
console.log(pocketParameters);
var pocketAuth = new PocketStrategy(pocketParameters,
  function(username, accessToken, done){
    process.nextTick(function(){
      return done(null, {
        username: username,
        accessToken: accessToken
      });
    });
  });
passport.use(pocketAuth);
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
      console.log(token);
      console.log(refreshToken);
      console.log(params);
        process.nextTick(function(){
            User.findOne({'googleId.id': profile.id}, function(err, appUser){
                if (err) return done(err);
                if (appUser){
                   appUser.googleId.token = token;
                    appUser.googleId.refreshToken = refreshToken;
                    appUser.lastTime = new Date();
                    return done(null, appUser);
                } else {
                  console.log("NEW USER");
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

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res){
  res.render('home');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/test', function(req, res) {
  console.log(req.user);
  res.json({});
});

router.get('/auth/google', passport.authenticate('google', {
  scope:['profile', 'email'],
  accessType: 'offline',
  approvalPrompt: 'force'}));

router.get('/auth/pocket', passport.authorize('pocket'), function(
  req, res){});

router.get('/auth/pocket/callback', passport.authorize('pocket',{
  failureRedirect: '/#/landing'}), function(req, res){
  var user = req.user;
  var account = req.account;
  user.pocketId.username = account.username;
  user.pocketId.accessToken = account.accessToken;
  user.save(function(err, savedUser){
    if (err){console.log(err);res.redirect('/#/landing');}
    res.redirect('/#/home');
  });
})

router.get('/auth/google/callback',passport.authenticate('google',{
	failureRedirect: '/#/landing'}), function(req, res){
  // console.log(req.query);
  // console.log(req.user);
  res.redirect('/#/home');
});


router.get('/friends', function(req, res, next) {
  Friend.find(function(err, friends){
    if(err){ return next(err); }

    res.json(friends);
  });
});

router.post('/friends', function(req, res, next) {
  var friend = new Friend(req.body);

  friend.save(function(err, friend){
    if(err){ return next(err); }

    res.json(friend);
  });
});

router.get('/friends/:friend', function(req, res, next) {
  req.friend.populate('notes', function(err, friend){
    res.json(friend);
  });});

router.post('test', function(req, res, next) {
  console.log(req.body);
});

router.get('/user/pocketToken', function(req, res, next) {
  // var pocketKeys = {};
  // console.log("UISER IS" + req.user);
  // pocketKeys.consumer_key = pocketParameters.consumerKey;
  // pocketKeys.access_token = req.user.pocketId.accessToken;
  // pocketKeys.count = "7";
  // pocketKeys.detailType = "complete";
  // console.log(pocketKeys);
  // var pocketKeys = {};
  // pocketKeys.value = "lolz";
  transporter.sendMail({
    from: 'inTouch@inTouch.com',
    to: 'edgarallenpoed@gmail.com',
    subject: 'Stay inTouch with...',
    text: 'These people!'
  });
  request.post({url:'https://getpocket.com/v3/get', formData: pocketKeys}, function(err, httpResponse, body){
    console.log(httpResponse);
    res.json(body);
  });
});




// router.put('/friends/:post/downvote', function(req, res, next) {
//   req.post.downvote(function(err, post){
//     if (err) { return next(err); }

//     res.json(post);
//   });
// });


router.post('/friends/:friend/notes', function(req, res, next) {
  var note = new Note(req.body);
  note.friend = req.friend;
  // console.log(note);
  note.save(function(err, note){
    if(err){return next(err); }

    req.friend.notes.push(note);
    req.friend.save(function(err, friend) {
      if(err){return next(err); }
      res.json(note);
    });
  });
});

router.delete('/friends/:friend/notes/:note', function(req, res, next) {
  // console.log("going to delete");
  // console.log(req.note);
  Note.remove({_id: req.note._id}, function(err){
    if (err) console.log(err);
    else console.log("success");
  });
});

router.put('/friends/:post/comments/:comment/upvote', function(req, res, next) {
	console.log(req.comment);
	req.comment.upvote(function(err, comment){
		if (err) {return next(err); console.log(err);}
		res.json(comment);
	});
});



router.param('friend', function(req, res, next, id) {
  var query = Friend.findById(id);

  query.exec(function (err, friend){
    if (err) { return next(err); }
    if (!friend) { return next(new Error("can't find friend")); }

    req.friend = friend;
    return next();
  });
});

router.param('note', function(req, res, next, id) {
  var query = Note.findById(id);

  query.exec(function (err, note){
    if (err) { return next(err); }
    if (!note) { return next(new Error("can't find note")); }

    req.note = note;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});

module.exports = router;
