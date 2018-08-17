const express = require('express');
const async = require('async');
const router = express.Router();
const conf = require('../config/config.js');
const pool = require('../config/db_con.js');

const pbkdf2Password = require('pbkdf2-password');
const phone_hasher = pbkdf2Password({
  keyLength: 10
});

router.get('/', function(req, res) {
  const email = req.query.email;
  const token = req.query.token;


  var arr = [
    (callback) => {
      var msg = "";
      var flag = false;
      if (email === undefined || token === undefined) {
        msg = "[0]잘못 된 접근입니다.";
      } else {
        msg = "인증 되었습니다.";
        flag = true;
      }
      callback(null, msg, flag);
    },

    (msg, flag, callback) => {
      if (flag) {
        pool.getConnection((err, connection) => {
          if (err) {
            callback("DB Connection Error : " + err);
          } else {
            callback(null, msg, flag, connection);
          }
        });
      } else {
        callback(null, msg, flag, false);
      }
    },

    (msg, flag, connection, callback) => {
      if (flag) {
        const verify_query = "SELECT userPhone FROM users WHERE userEmail=?";
        connection.query(verify_query, email, (err, rows) => {
          if (err) {
            callback("Query Error : " + err);
          } else {
            var userPhone = rows[0].userPhone;
            console.log(userPhone);
            callback(null, userPhone, msg, flag, connection);
          }
        });
      } else {
        callback(null, false, msg, flag, false);
      }
    },

    (userPhone, msg, flag, connection, callback) => {
      if (flag) {
        phone_hasher({
          password: email,
          salt: userPhone
        }, function(err, pass, salt, hash) {
          if (err) {
            callback("Hashing Error :" + err);
          } else {
            if(token===hash){
              callback(null,msg,flag,connection);
            }else{
              flag=false;
              msg="[1]잘못 된 접근입니다.";
              console.log(hash+" and "+token);
              callback(null, msg, flag, false);
            }
          }
        });
      } else {
        callback(null, msg, flag, false);
      }
    },

    (msg, flag, connection, callback) => {
      if (flag) {
        const query = "UPDATE users SET userInvalid='true' WHERE userEmail=?";
        connection.query(query, email, (err, rows) => {
          if (err) {
            connection.release();
            callback("Query Error : " + err);
          } else {
            connection.release();
            callback(null, msg);
          }
        });
      } else {
        callback(null, msg);
      }
    }
  ];


  async.waterfall(arr, (err, result) => {
    if (err) {
      console.log("Error Detected.");
      console.log(err);
    } else {
      res.render('./auth/auth', {
        msg: result
      });
    }
  });
});

module.exports = router;
