var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var mongoose = require('mongoose');
var config = require('./config');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);
app.use( express.static(path.join(__dirname, 'public')));

app.use('/public', express.static('public'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



//Mongoose Inititalization
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri);
// mongoose.set('debug', true);

app.use('/users', users);
app.use('/api', api);

//Session and Passport Middlewear

//Express Passport Session Middlewear Setup
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(expressSession);


//Passport Configuration
var passportConfig = require('./auth/passport-config');
passportConfig();

//Express Session Middlewear use
app.use(expressSession({
  secret: 'Kamehameha',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Admin Routing without Mongoose Initialization
app.use('/admin', admin);
app.use('/', index);



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