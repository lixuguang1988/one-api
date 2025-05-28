var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var { expressjwt } = require('express-jwt');

var { jwtConfig } = require('./config/index');
// var jwtVerify = require('./middleware/jwtVerify');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var permissionRouter = require('./routes/permissions');
var departmentRouter = require('./routes/departments');
var roleRouter = require('./routes/roles');
var columnRouter = require('./routes/columns');
var commonRouter = require('./routes/common');
var dictRouter = require('./routes/dicts');
var newsRouter = require('./routes/news');

var { init: redisInit } = require('./redis/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(jwtVerify);

// app.use(
//   expressjwt({
//     secret: jwtConfig.secret,
//     algorithms: ["HS256"],
//     credentialsRequired: false,
//     getToken: function fromHeaderOrQuerystring(req) {
//       debugger
//       if (
//         req.headers.authorization
//       ) {
//         return req.headers.authorization;
//       } else if (req.query && req.query.token) {
//         return req.query.token;
//       }
//       return null;
//     },
//     // isRevoked: async function (req, payload, done) {
//     //   console.log(payload, 'isRevoked')
//     //   return true;
//     // },
//     // onExpired: function (req, err) {
//     //   if (new Date() - err.inner.expiredAt < 5000) { return;}
//     //   throw err;
//     // }
//   }).unless(['/users/login', /^\/notoken/,  /^\/.+\/notoken/])
// );

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/user', userRouter);
app.use('/department', departmentRouter);
app.use('/permission', permissionRouter);
app.use('/role', roleRouter);
app.use('/column', columnRouter);
app.use('/common', commonRouter);
app.use('/news', newsRouter);
app.use('/dict', dictRouter);

redisInit();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(404).json({ code: 404, message: 'Not Found', data: null });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.status === 401) {
    res.status(200).send({
      code: 401,
      message: 'token无效',
    });
    return;
  }

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
