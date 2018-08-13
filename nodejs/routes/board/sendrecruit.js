var express = require('express');
var async = require('async');
var router = express.Router();
//js 파일 경로

var pool = require('../config/db_con');

router.get('/', function(req,res){
   var sql = "insert into recruit_list values (?,?,?,?,?)"
   var re_id;
   var id;
   var pid;
   var status;
   var contents;
  var arr =[
    (callback)=>{
      pool.getConnection((err, connection) => {
        console.log('커넥션시작');
        if (err) { //디비연결 실패
          console.log('send디비연결실패');
          res.status(500).send({
            status: false,
          });
          connection.release();
          callback("db err" + err);
        } else { //디비연결 성공
          console.log('send디비연결성공');
          callback(null, connection);
        }
      });
    },
    (connection, callback) =>{
      connection.query(sql,[re_id,id,pid,status,contents], function(err, rows) {
        if(err){
          console.log(err);
          connection.release();
          callback("db err2" + err);
        }else{
          console.log('커밋한다.');
          connection.commit(function(err){
            if(err){
              console.log(err);
              connection.release();
            }
            connection.release();
          });
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
