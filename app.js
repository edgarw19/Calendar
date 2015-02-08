var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var googleAuth =
{
        'clientID'      : '375009401841-n8lbs9fqtom68hbh9oo1dprpj7l3gq0f.apps.googleusercontent.com',
        'clientSecret'  : 'lcFBv3AtdTrc_lRyyj4EZ8-I',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    };

var mongoose = require('mongoose');
var Post = require('./models/Posts.js');
var User = require('./models/Users.js');
var Friend = require('./models/Friends.js');
var Note = require('./models/Notes.js');
var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

mongoose.connect('mongodb://edgarw19:poepoe123@ds041821.mongolab.com:41821/pcalendar');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({cookie: {maxAge: 3600000},secret: 'bhaoweihao;ehg;aiwehg', saveUninitialized: true, resave:true}));
app.use(passport.initialize());
app.use(passport.session());





app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
