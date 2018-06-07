var express = require('express');
var async = require('async');
var router = express.Router();
//js 파일 경로

var pool = require('../config/db_con');

// 게시글 리스트 불러오기
router.get('/', function(req,res){
   var sql = 'SELECT * FROM project_post WHERE pid='+req.query.pid;

  var arr =[
    (callback)=>{
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
    (connection, callback) =>{
      connection.query(sql, function(err, rows, fields) {
          if (err) {
              res.sendStatus(400);
              return;
          }
          if (rows.length == 0) {
              res.sendStatus(204);
          } else {
             res.status(201).send(rows);
              res.end();
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
