var createError = require('http-errors');
var express = require('express');
var path = require('path');
var routes=require('./routes');
var http=require('http');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

//bodyParser를 사용하기 위해서
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// view engine setup
app.set('port',10002);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//라우팅
app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
http.createServer(app).listen(app.get('port'),function(){
  console.log('Express 서버 실행중');
});
module.exports = app;
