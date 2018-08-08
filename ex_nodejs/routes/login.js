var express = require('express');
var async = require('async');
var router = express.Router();
var jwt = require('jsonwebtoken');
var pool = require('./config/db_con');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());

const conf = require('./config/config.js');

router.get('/', function(req, res) {
  res.render('login');
});

router.post('/', function(req, res) {

  var pbkdf2Password = require('pbkdf2-password');
  var hasher = pbkdf2Password();

  var arr = [
    (callback) => {
      pool.getConnection((err, connection) => {
        if (err) {
          res.status(500).send({
            status: false,
            msg: 'DB Connection Failed.'
          });
          connection.release();
          callback('DB Connection Failed' + err);
        } else {
          callback(null, connection);
        }
      });
    },
    (connection, callback) => {
      var login_query = 'SELECT count(*) AS cnt, userId, userPass, userSalt FROM users WHERE userId = ?';
      connection.query(login_query, [req.body.userId], function(err, rows) {
        if (err) {
          res.status(500).send({
            status: false,
            msg: 'Query Error.'
          });
          connection.release();
          callback('Query Error :' + err);
        } else {
          if (rows.cnt === 0) {
            res.status(500).send({
              status: false,
              msg: 'ID doens\'t exist.',
            });
            connection.release();
            //id가 존재하지 않을때의 logic을 적어야함.
          } else {
            var info = new Array();
            info[0] = rows[0].userId;
            info[1] = rows[0].userPass;
            info[2] = rows[0].userSalt;
            connection.release();
            callback(null, info);
          }
        }
      });
    },
    (info, callback) => {
      hasher({
        password: req.body.userPass,
        salt: info[2]
      }, function(err, pass, salt, hash) {
        if (err) {
          callback("Hashing Error :" + err);
        } else {
          if (hash === info[1]) {
            callback(null, info[0]);
          } else {
            res.status(500).send({
              status: false,
              msg: 'Incorrect password.'
            });
            callback("Incorrect Password :",err);
          }
        }
      });
    },
    (userId, callback) => {
      var payload ={
        'type':'jwt',
        'userId':userId
      };

      jwt.sign(
        payload,
        conf.secret, {
          algorithm: 'HS512',
          expiresIn: '1h'
        },
        function(err, token) {
          if (err) {
            res.status(500).send({
              status: false,
              msg: 'Issuing token failed.'
            });
            callback("Token issue Error :" + err);
          } else {
            callback(null, token);
          }
        });
    }
  ];

  async.waterfall(arr, (err, result) => {
    if (err) {
      console.log("Error Detected.");
      console.log(err);
    } else {
      // app.use(cookieParser('HashKey')); // 해시된것 파싱해서 사용할땐 req.signedCookies 사용
      // res.cookie('jwt',result,{httpOnly:true,signed:true});

      res.cookie('jwt',result,{httpOnly:true});
      res.redirect(302, '/verify');
    }
  });

});

module.exports = router;
