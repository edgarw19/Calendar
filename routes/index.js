var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Note = require('../models/Notes.js');
var Friend = require('../models/Friends.js');
var User = mongoose.model('User');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var PocketStrategy = require('passport-pocket');
var request = require('request');
var nodemailer = require('nodemailer');
var cronJob = require('cron').CronJob;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: 'intouch.novv@gmail.com',
    pass: 'intouch123'
  }
});
// var job = new cronJob('* 2 * * * *', function(){
//     var pocketKeys = {};
//   console.log("UISER IS" + req.user);
//   pocketKeys.consumer_key = pocketParameters.consumerKey;
//   pocketKeys.access_token = req.user.pocketId.accessToken;
//   pocketKeys.count = "7";
//   pocketKeys.detailType = "complete";
//   console.log(pocketKeys);
//   request.post({url:'https://getpocket.com/v3/get', formData: pocketKeys}, function(err, httpResponse, body){
//     console.log(body);
//     console.log(httpResponse);
//     transporter.sendMail({
//     from: 'inTouch@inTouch.com',
//     to: 'edgarallenpoed@gmail.com',
//     subject: 'Stay inTouch with...',
//     text: body
//   });
//     res.json(body);
//   });
// }, null, true);
// var mailgunKeys = {
//   apiKey: key-4c65ef91a6080fd82f50c2cda6159e14,
//   domain:
// }

// var tests = User.find({}, function(err, users){
//   for (var i = 0; i < users.length; i++){
//     var curUser = users[i];
//     if (curUser.pocketId.username != "None"){
//           var pocketKeys = {};
//   pocketKeys.consumer_key = pocketParameters.consumerKey;
//   pocketKeys.access_token = curUser.pocketId.accessToken;
//   pocketKeys.count = "1";
//   pocketKeys.detailType = "complete";
//   console.log(pocketKeys);
//   console.log("here right now");
//         request.post({url:'https://getpocket.com/v3/get', formData: pocketKeys}, function(err, httpResponse, body){
//     var results = "";
//     console.log(body);
//     console.log(body.status);
//     console.log(body.complete);
//     console.log(body['complete']);
//     console.log(body['list']);
//     console.log("fail");
//     var bodz = JSON.parse(body);
//     console.log(bodz.list);
//     var newBody = JSON.stringify(body);
//     console.log(newBody.list);
//     for (key in body.list){
//       console.log("HIII");
//       var listItem = body.list[key];
//       results += listItem['given_url'];
//       results += listItem['given_title'];
//     };
//     console.log("here again");
//     console.log(results);
//   //   transporter.sendMail({
//   //   from: 'inTouch@inTouch.com',
//   //   to: 'edgarallenpoed@gmail.com',
//   //   subject: 'Stay inTouch with...',
//   //   text: body
//   // });
//     });
//   };
// }});
var testing ={"status":1,"complete":1,"list":{"792489954":{"item_id":"792489954","resolved_id":"792489954","given_url":"http:\/\/www.liveathos.com\/?gclid=Cj0KEQiAzb-kBRDe49qh9s75m-wBEiQATOxgwZcJ5_ws34o4PUSUYDGqs8HEbLF-LyjxrTPOwn6AYV8aAmMk8P8HAQ","given_title":"Athos - Wearable Technology for Fitness","favorite":"0","status":"0","time_added":"1418754744","time_updated":"1418754746","time_read":"0","time_favorited":"0","sort_id":0,"resolved_title":"Wearable Technology for Fitness","resolved_url":"http:\/\/www.liveathos.com\/?gclid=Cj0KEQiAzb-kBRDe49qh9s75m-wBEiQATOxgwZcJ5_ws34o4PUSUYDGqs8HEbLF-LyjxrTPOwn6AYV8aAmMk8P8HAQ","excerpt":"Thank you for reserving Athos. You will receive a confirmation email with reservation details and a referral link where you get $10 off your next order.","is_article":"0","is_index":"0","has_video":"0","has_image":"0","word_count":"25"},"692647226":{"item_id":"692647226","resolved_id":"692647226","given_url":"http:\/\/www.terrafugia.com\/news","given_title":"News | Terrafugia","favorite":"0","status":"0","time_added":"1418754204","time_updated":"1418754204","time_read":"0","time_favorited":"0","sort_id":1,"resolved_title":"News","resolved_url":"http:\/\/www.terrafugia.com\/news","excerpt":"","is_article":"0","is_index":"1","has_video":"0","has_image":"0","word_count":"0"},"152321924":{"item_id":"152321924","resolved_id":"152321924","given_url":"https:\/\/chocedge.com\/","given_title":"Choc Edge | Creating your chocolate in style","favorite":"0","status":"0","time_added":"1418073238","time_updated":"1418073238","time_read":"0","time_favorited":"0","sort_id":2,"resolved_title":"Choc Edge","resolved_url":"https:\/\/chocedge.com\/","excerpt":"Looking for a unique gift? Choc Edge offers bespoke 2D chocolate gifts  See all our latest news and get connected to our social media networks here!","is_article":"0","is_index":"1","has_video":"1","has_image":"1","word_count":"108","image":{"item_id":"152321924","src":"https:\/\/chocedge.com\/cms-assets\/zoom-cropped-images\/573643_0_bannerImageOne.jpg?rand=0.4305416594725102","width":"0","height":"0"},"images":{"1":{"item_id":"152321924","image_id":"1","src":"https:\/\/chocedge.com\/cms-assets\/zoom-cropped-images\/573643_0_bannerImageOne.jpg?rand=0.4305416594725102","width":"0","height":"0","credit":"","caption":""},"2":{"item_id":"152321924","image_id":"2","src":"https:\/\/chocedge.com\/cms-assets\/zoom-cropped-images\/573643_0_bannerImageThree.jpg?rand=0.7648991486057639","width":"0","height":"0","credit":"","caption":""},"3":{"item_id":"152321924","image_id":"3","src":"https:\/\/chocedge.com\/cms-assets\/zoom-cropped-images\/416767_0_bannerImageFour.jp?rand=0.3235759437084198","width":"0","height":"0","credit":"","caption":""},"4":{"item_id":"152321924","image_id":"4","src":"https:\/\/chocedge.com\/cms-assets\/zoom-cropped-images\/573643_0_iconBoxImage01.png?rand=0.7308127910364419","width":"0","height":"0","credit":"","caption":""},"5":{"item_id":"152321924","image_id":"5","src":"https:\/\/chocedge.com\/cms-assets\/images\/996165.trainingiconorange.png?rand=0.659035507356748","width":"0","height":"0","credit":"","caption":""},"6":{"item_id":"152321924","image_id":"6","src":"https:\/\/chocedge.com\/cms-assets\/images\/823492.support-icon-lady-orange.png?rand=0.4251523318234831","width":"0","height":"0","credit":"","caption":""},"7":{"item_id":"152321924","image_id":"7","src":"https:\/\/chocedge.com\/cms-assets\/zoom-cropped-images\/573643_0_blogBoxImage02.jpg?rand=0.2863297665026039","width":"0","height":"0","credit":"","caption":""},"8":{"item_id":"152321924","image_id":"8","src":"https:\/\/chocedge.com\/cms-assets\/zoom-cropped-images\/573643_0_blogBoxImage03.jpg?rand=0.6585355929564685","width":"0","height":"0","credit":"","caption":""},"9":{"item_id":"152321924","image_id":"9","src":"https:\/\/chocedge.com\/cms-assets\/images\/751195.machine-icon-orange.png?rand=0.6729383391793817","width":"0","height":"0","credit":"","caption":""},"10":{"item_id":"152321924","image_id":"10","src":"https:\/\/chocedge.com\/new-site\/images\/icon-services.png","width":"0","height":"0","credit":"","caption":""},"11":{"item_id":"152321924","image_id":"11","src":"https:\/\/chocedge.com\/images\/icon-shop.png","width":"0","height":"0","credit":"","caption":""},"12":{"item_id":"152321924","image_id":"12","src":"https:\/\/chocedge.com\/images\/email-icon.png","width":"0","height":"0","credit":"","caption":""}},"videos":{"1":{"item_id":"152321924","video_id":"1","src":"\/\/www.youtube.com\/embed\/8FUq_2IU2Uo","width":"300","height":"169","type":"1","vid":"8FUq_2IU2Uo"},"2":{"item_id":"152321924","video_id":"2","src":"\/\/www.youtube.com\/embed\/2bqbOKDY3tE","width":"300","height":"169","type":"1","vid":"2bqbOKDY3tE"},"3":{"item_id":"152321924","video_id":"3","src":"\/\/www.youtube.com\/embed\/Ue6sSX7cK7I","width":"300","height":"169","type":"1","vid":"Ue6sSX7cK7I"}}},"783320919":{"item_id":"783320919","resolved_id":"783320919","given_url":"http:\/\/www.fastcoexist.com\/3038984\/this-bio-drone-grows-itself-and-then-melts-into-a-puddle-of-sugar-when-its-done-flying","given_title":"This Bio-Drone Grows Itself, And Then Melts Into A Puddle Of Sugar When It'","favorite":"0","status":"0","time_added":"1418023389","time_updated":"1418023389","time_read":"0","time_favorited":"0","sort_id":3,"resolved_title":"This Bio-Drone Grows Itself, And Then Melts Into A Puddle Of Sugar When It's Done Flying","resolved_url":"http:\/\/www.fastcoexist.com\/3038984\/this-bio-drone-grows-itself-and-then-melts-into-a-puddle-of-sugar-when-its-done-flying","excerpt":"Civilian drones may someday deliver your pizza, but they'll also travel places that people can't easily go, mapping forest fires or natural disasters, tracking wildlife, and studying Mars.  The further drones go, the more it might make sense to construct them out of biological materials.","is_article":"1","is_index":"0","has_video":"0","has_image":"1","word_count":"484","image":{"item_id":"783320919","src":"http:\/\/a.fastcompany.net\/multisite_files\/fastcompany\/imagecache\/inline-large\/inline\/2014\/12\/3038984-inline-i-1-this-bio-drone-can-grow-itself-and-then-melt-into-a-puddle-of-sugar-when-its-not-needed.png","width":"0","height":"0"},"images":{"1":{"item_id":"783320919","image_id":"1","src":"http:\/\/a.fastcompany.net\/multisite_files\/fastcompany\/imagecache\/inline-large\/inline\/2014\/12\/3038984-inline-i-1-this-bio-drone-can-grow-itself-and-then-melt-into-a-puddle-of-sugar-when-its-not-needed.png","width":"0","height":"0","credit":"","caption":""},"2":{"item_id":"783320919","image_id":"2","src":"http:\/\/b.fastcompany.net\/multisite_files\/fastcompany\/imagecache\/inline-large\/inline\/2014\/12\/3038984-inline-i-2-this-bio-drone-can-grow-itself-and-then-copy.jpg","width":"0","height":"0","credit":"","caption":""}}},"595965485":{"item_id":"595965485","resolved_id":"595965485","given_url":"http:\/\/nymag.com\/nymetro\/news\/bizfinance\/columns\/bottomline\/1778\/","given_title":"Is That Your Final Offer?","favorite":"0","status":"0","time_added":"1416772750","time_updated":"1416772750","time_read":"0","time_favorited":"0","sort_id":4,"resolved_title":"Is That Your Final Offer?","resolved_url":"http:\/\/nymag.com\/nymetro\/news\/bizfinance\/columns\/bottomline\/1778\/","excerpt":"The technology of the twenty-first century is bringing back the marketplace of the eighteenth. But do consumers really want to bid for their breakfast? A few weeks ago, I bought a big box of Kellogg's Raisin Bran at my neighborhood D'Agostino for $2.41.","is_article":"1","is_index":"0","has_video":"0","has_image":"0","word_count":"1506","authors":{"18584964":{"item_id":"595965485","author_id":"18584964","name":"Steve Bodow","url":"http:\/\/nymag.com\/nymag\/author_348"}}},"69969":{"item_id":"69969","resolved_id":"69969","given_url":"https:\/\/www.facebook.com\/","given_title":"Facebook","favorite":"0","status":"0","time_added":"1416592955","time_updated":"1416592955","time_read":"0","time_favorited":"0","sort_id":5,"resolved_title":"Facebook logo","resolved_url":"https:\/\/www.facebook.com","excerpt":"Connect with friends and theworld around you on Facebook.  See photos and updates  from friends in News Feed.  Share what's new  in your life on your Timeline.  Find more  of what you're looking for with Graph Search. Sign UpIt\u2019s free and always will be.","is_article":"0","is_index":"1","has_video":"0","has_image":"1","word_count":"46","image":{"item_id":"69969","src":"https:\/\/fbcdn-dragon-a.akamaihd.net\/hphotos-ak-xap1\/t39.2365-6\/851565_602269956474188_918638970_n.png","width":"0","height":"0"},"images":{"1":{"item_id":"69969","image_id":"1","src":"https:\/\/fbcdn-dragon-a.akamaihd.net\/hphotos-ak-xap1\/t39.2365-6\/851565_602269956474188_918638970_n.png","width":"0","height":"0","credit":"","caption":""},"2":{"item_id":"69969","image_id":"2","src":"https:\/\/fbcdn-dragon-a.akamaihd.net\/hphotos-ak-xap1\/t39.2365-6\/851585_216271631855613_2121533625_n.png","width":"0","height":"0","credit":"","caption":""},"3":{"item_id":"69969","image_id":"3","src":"https:\/\/fbcdn-dragon-a.akamaihd.net\/hphotos-ak-xap1\/t39.2365-6\/851558_160351450817973_1678868765_n.png","width":"0","height":"0","credit":"","caption":""}}},"562371829":{"item_id":"562371829","resolved_id":"562371829","given_url":"http:\/\/time.com\/12786\/the-new-barbie-meet-the-doll-with-an-average-womans-proportions\/","given_title":"Lammily: New Barbie with Average Body by Nickolay Lamm","favorite":"0","status":"0","time_added":"1416472126","time_updated":"1416472126","time_read":"0","time_favorited":"0","sort_id":6,"resolved_title":"The New Barbie: Meet the Doll with an Average Woman\u2019s Proportions","resolved_url":"http:\/\/time.com\/12786\/the-new-barbie-meet-the-doll-with-an-average-womans-proportions\/","excerpt":"While we might admire Barbie\u2019s career aspirations, the dolls famously unrealistic body proportions (which would force a real woman to walk on all fours\u2026 with half a liver) leave a lot to be desired.","is_article":"1","is_index":"0","has_video":"1","has_image":"1","word_count":"388","authors":{"17153555":{"item_id":"562371829","author_id":"17153555","name":"Laura Stampler","url":"http:\/\/time.com\/author\/laura-stampler\/"}},"image":{"item_id":"562371829","src":"http:\/\/timenewsfeed.files.wordpress.com\/2014\/03\/1.jpg","width":"0","height":"0"},"images":{"1":{"item_id":"562371829","image_id":"1","src":"http:\/\/timenewsfeed.files.wordpress.com\/2014\/03\/1.jpg","width":"0","height":"0","credit":"Nickolay Lamm","caption":"Nickolay Lamm"},"2":{"item_id":"562371829","image_id":"2","src":"http:\/\/timenewsfeed.files.wordpress.com\/2014\/03\/15.jpeg","width":"0","height":"0","credit":"Nickolay Lamm","caption":"Nickolay Lamm"},"3":{"item_id":"562371829","image_id":"3","src":"http:\/\/timenewsfeed.files.wordpress.com\/2014\/03\/9.jpg","width":"0","height":"0","credit":"Nickolay Lamm","caption":"Nickolay Lamm"},"4":{"item_id":"562371829","image_id":"4","src":"http:\/\/timenewsfeed.files.wordpress.com\/2014\/03\/11.jpeg","width":"0","height":"0","credit":"Nickolay Lamm","caption":"Nickolay Lamm"},"5":{"item_id":"562371829","image_id":"5","src":"http:\/\/timenewsfeed.files.wordpress.com\/2014\/03\/14.jpg","width":"0","height":"0","credit":"Nickolay Lamm","caption":"Nickolay Lamm"},"6":{"item_id":"562371829","image_id":"6","src":"http:\/\/timenewsfeed.files.wordpress.com\/2014\/03\/5.jpeg","width":"0","height":"0","credit":"Nickolay Lamm","caption":"Nickolay Lamm"}},"videos":{"1":{"item_id":"562371829","video_id":"1","src":"http:\/\/www.youtube.com\/embed\/OfQu8pq0kok?version=3&rel=1&fs=1&showsearch=0&showinfo=1&iv_load_policy=1&wmode=transparent","width":"640","height":"390","type":"1","vid":"OfQu8pq0kok"}}}},"error":null,"search_meta":{"search_type":"normal"},"since":1419641101};
// for (key in testing.list){
//   var blahz = testing.list[key];
//  // console.log(blahz);
//   console.log("LOLZ");
//   console.log(blahz['given_url']);
//   console.log(blahz['given_title']);
//   // for (extra in blahz){
//   //   console.log(extra);
//   // };
//   //console.log(blahz[given_title]);
// };
var mailgun = require('mailgun-js')({apiKey:'key-4c65ef91a6080fd82f50c2cda6159e14'});
var data ={
  from: 'inTouch',
  to: 'edgarallenpoed@gmail.com',
  subject: 'Hello',
  text:' Testing some mailgun awesomeness!'
};
// console.log("mailgun");
// mailgun.messages().send(data, function(error, body){
//   console.log("CAME");
//   console.log(body);
//   console.log(error);
// });


// PASSPORT AUTHENTICATION
//------------------------------------------------------------------------
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
  process.nextTick(function(){
    User.findOne({'googleId.id': profile.id}, function(err, appUser){
      if (err) return done(err);
      if (appUser){
       appUser.googleId.token = token;
       appUser.googleId.refreshToken = refreshToken;
       appUser.lastTime = new Date();
       return done(null, appUser);
     } else {
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
  Friend.find({'user': req.user._id}, function(err, friends){
    console.log("heyo");
    console.log(friends);
    res.json(friends);
  });
});

router.post('/friends', function(req, res, next) {
  var friend = new Friend(req.body);
  friend.user = req.user._id;
  friend.save(function(err, savedFriend){
    if (err){return next(err)};
    req.user.friends.push(savedFriend._id);
    req.user.save(function(err, updatedUser){
      res.json(savedFriend);
    });
  });
});

router.get('/friends/:friend', function(req, res, next) {
    res.json(req.friend);
});

router.get('/friends/:friend/notes', function(req, res, next) {
  console.log("Trying to grab notes");
    Note.find({'friend': req.friend._id}, function(err, notes){
      console.log(notes);
      res.json(notes);
    });
});


router.post('test', function(req, res, next) {
  console.log(req.body);
});

router.get('/user/pocketToken', function(req, res, next) {
  var pocketKeys = {};
  console.log("UISER IS" + req.user);
  pocketKeys.consumer_key = pocketParameters.consumerKey;
  pocketKeys.access_token = req.user.pocketId.accessToken;
  pocketKeys.count = "7";
  pocketKeys.detailType = "complete";
  console.log(pocketKeys);
  
  request.post({url:'https://getpocket.com/v3/get', formData: pocketKeys}, function(err, httpResponse, body){
    console.log(body);
    console.log(httpResponse);
    transporter.sendMail({
      from: 'inTouch@inTouch.com',
      to: 'edgarallenpoed@gmail.com',
      subject: 'Stay inTouch with...',
      text: body
    });
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
  note.friend = req.friend._id;
  note.user = req.user._id;
  // console.log(note);
  note.save(function(err, note){
    if(err){console.log("hjere" + err);return next(err); }

    req.friend.notes.push(note._id);
    console.log(note);
    req.friend.save(function(err, friend) {
      console.log(friend);
      if(err){console.log('herex' + err);return next(err); }
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
