//projectView.ejs를 렌더링 해준다.
var express = require('express');
var async = require('async');
var router = express.Router();
//js 파일 경로

var pool = require('../config/db_con');

var sql = "select * from hobby_post";

/* GET home page. */
router.get('/', function(req, res, next) {
var arr=[

  (callback) => {
    pool.getConnection((err, connection) => {
      console.log('커넥션시작');
      if (err) { //디비연결 실패
        res.status(500).send({
          status: false,
        });
        connection.release();
        callback("db err" + err);
      } else { //디비연결 성공
        console.log('디비연결성공');
        callback(null, connection);
      }
    });
  },
  (connection, callback) => {
    connection.query(sql, function(err, rows) {
      if (err) {
        console.log(err);
        connection.release();
        callback("db err2" + err);
      }

      if (rows.length > 0) {
        res.render('hobbyView', {
          rows: rows
        });
      } else {
        res.render('hobbyView');
      }
    });
  }
];




async.waterfall(arr, (err, result) => {
  if (err) console.log(err);
  else console.log(result);
});

});



module.exports = router;
