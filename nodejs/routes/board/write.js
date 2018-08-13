
var express = require('express');
var async = require('async');
var router = express.Router();
//js 파일 경로

var pool = require('../config/db_con');

var sql = " (title,category,preference,recruit,deadline,contents) values (?,?,?,?,?,?)";

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('write');
});

router.post('/', function(req, res, next) {
var title=req.body.title;
var category=req.body.category;
var preference=req.body.preference;
var recruit = req.body.recruit;
var deadline = req.body.deadline;
var content = req.body.contents;

  var table = "Insert into " + req.body.board;
  var str = req.body.board;
  var path = str.substring(0,str.length-5)+'View';
  var rs = table + sql;
  var arr = [

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
      connection.query(rs,[title,category,preference,recruit,deadline,content] ,function(err,rows){
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
            }else{
              //list로 넘기기
              console.log('넘긴다.');
              res.redirect(302,'/board/'+path);
            }
          });
        }

      });
      connection.release();
    }
  ];


  async.waterfall(arr, (err, result) => {
    if (err) console.log(err);
    else console.log(result);
  });

});

module.exports = router;
