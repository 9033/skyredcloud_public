var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//log
var logger = require('morgan');
var rfs = require('rotating-file-stream');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var buslocsRouter = require('./routes/buslocs');

var app = express();

//http://expressjs.com/ko/advanced/best-practice-security.html
app.disable('x-powered-by');


// error handler
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const middd=require('./middd.js');
app.use(middd);

var logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});
//app.use(logger('dev'));//combined, common, default (deprecate), short, tiny
app.use(logger('combined', { stream: accessLogStream }));



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/buslocs', buslocsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  //setTimeout(res.render,1000,'404',{title:404});
  //res.render('error');//detail
  res.render('404',{title:404});//simple
});

module.exports = app;
