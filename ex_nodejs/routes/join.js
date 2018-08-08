var express = require('express');
var async = require('async');
var router = express.Router();



router.get('/',function(req,res){
  res.render('join');
});

router.post('/',function(req,res){
  var pool = require('./config/db_con');

  var pbkdf2Password = require('pbkdf2-password');
  var hasher= pbkdf2Password();

  var query="INSERT INTO users values(?,?,?)";

  var userId=req.body.userId;
  var userPass;
  var userSalt;

  var arr=[
    (callback)=>{
      hasher({password:req.body.userPass},function(err,pass,salt,hash){
        if(err){
          callback("Hashing Error :",err);
        }else{
        userPass=hash;
        userSalt=salt;
        callback(null);
      }
      });
  },
    (callback)=>{
      pool.getConnection((err,connection)=>{
        if(err){
          res.status(500).send({
            status:false,
            msg:"DB Connection Fail"
          });
          connection.release();
          callback("DB Connection Fail : "+err);
        }else{
          callback(null,connection);
        }
      });
    },
    (connection,callback)=>{
      connection.query(query,[userId,userPass,userSalt],function(err,rows){
        if(err){
          res.status(500).send({
            status:false,
            msg:"Query Error."
          });
          connection.release();
          callback("Query Error : "+err);
        }else{
          connection.commit(function(err){
            if(err){
              res.stutus(500).send({
                status:false,
                msg:"Commit Error."
              });
              connection.release();
              callback("Commit Error : "+err);
            }else{
              connection.release();
              callback(null,true);
            }
          });
        }
      });
    }
  ];

async.waterfall(arr,(err,result) =>{
  if(err){
    console.log("Error Detected.");
    console.log(err);
  }else{
    res.redirect(302,'/login');
  }
});

});

module.exports = router;
