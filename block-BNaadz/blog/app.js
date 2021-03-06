var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var auth = require('./middlewares/auth');

require('dotenv').config();

var indexRouter = require('./routes/index');
var articlesRouter = require('./routes/articles');
var commentRouter = require('./routes/comments');
var userRouter = require('./routes/users');

mongoose.connect(
  'mongodb://localhost/blog',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => console.log(err ? err : 'Database connected!')
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  })
);

// add flash
app.use(flash());

// userInfo 
app.use(auth.userInfo);

// router 
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/articles', articlesRouter);
app.use(auth.isUserLogged);
app.use('/comments', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
