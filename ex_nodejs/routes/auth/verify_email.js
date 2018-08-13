const express = require('express');
const async = require('async');
const router = express.Router();
const conf = require('../config/config.js');
const pool = require('../config/db_con.js');


router.get('/', function(req, res) {
  const email = req.query.email;
  const token = req.query.token;

  var arr = [
    (callback) => {
      var msg="";
      var flag = false;
      if (email === undefined || token === undefined) {
        msg = "잘못 된 접근입니다.";
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
      const query = "UPDATE users SET userInvalid='true' WHERE userEmail=?";
        connection.query(query,email, (err, rows) => {
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
        msg:result
      });
    }
  });
});

module.exports = router;
