//login.ejs에서 정보를 받아와 처리를 하는 js

var express = require('express');
var async = require('async');
var router = express.Router();

//디비정보 불러옴
var pool = require('./config/db_con');

//쿼리문 정리
var newface ='select * from member where stuid= ?';

router.post('/', function(req, res) {
  //console.log(req.query.id);
var stuid = req.body.id;
var pass= req.body.pass;
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
      connection.query(newface,stuid ,function(err,rows){
        if(err){
          console.log(err);
          connection.release();
          callback("db err2" + err);
        }

        if(rows.length > 0){
          console.log('가입자');
          //패스워드 비교후 로그인시킨다.
          if(rows[0].pass==pass){
            //세션값 지정후
            res.redirect(302,'/board/main');
          }else{
            //비밀번호 틀림
            //다시 로그인창으로
            res.render("login");
          }


        }else{
          //첫방문 >> 추가정보 입력란으로
          console.log("첫방문");
          res.render('../views/firstLogin',{id:stuid});
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
