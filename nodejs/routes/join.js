var express = require('express');
var async = require('async');
var router = express.Router();

var pool = require('./config/db_con');

router.get('/',function(req,res,next){
  res.render('join');
});


router.post('/', function(req, res, next) {

var stuid=req.body.stuid;
var name = req.body.name;
var pass = req.body.pass;
var pass_chk = req.body.pass_chk;
var major = req.body.major;
var submajor=req.body.submajor;
var grade = req.body.grade;
var tel = req.body.tel;
var email= req.body.email;

var sql = "Insert into member values (?,?,?,?,?,?,?,?,?)";

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
    connection.query(sql,[stuid,pass,name,major,submajor,grade,tel,email,'재학'] ,function(err,rows){
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
            console.log('넘긴다.');
            res.redirect(302,'/login');
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
