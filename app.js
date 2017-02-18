var express = require('express');
var session = require('express-session');
var flash = require('express-flash');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//models
var User = require('./models/user.model');
var Pad = require('./models/pad.model');

//routes
var index = require('./routes/index');
var user = require('./routes/app/user');
var pad = require('./routes/app/pad');
var appIndex = require('./routes/app/index');


//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1:27017/jayhacks';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var app = express();

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(session({secret: 'gizmocat'}));
app.use(passport.initialize());
app.use(passport.session());

//define our other routes files here
app.use('/', index);
app.use('/app', appIndex);
app.use('/app/user', user);
app.use('/app/pad', pad);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
