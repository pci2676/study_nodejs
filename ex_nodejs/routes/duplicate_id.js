const express = require('express');
const async = require('async');
const router = express.Router();
const pool = require('./config/db_con.js');

router.post('/duplicate_id',function(req,res){
console.log('중복체크중...');
var want_id = req.body.input;
const query ="SELECT count(*) AS data FROM users WHERE userId = ?";

  var arr = [
    (callback)=>{
      pool.getConnection((err,connection)=>{
        if(err){
          callback("DB Connection Error :"+err);
        }else{
          callback(null,connection);
        }
      });

    },
    (connection, callback)=>{
      connection.query(query,want_id,(err,rows)=>{
        if(err){
          connection.release();
          callback("Query Error :"+err);
        }else{
          data=rows.data;
          connection.release();
          var flag;
          if(data>0){
            flag=false;
          }
          else{
            flag=true;
          }
          callback(null,flag);
        }
      });
    }
  ];

  async.waterfall(arr,(err,result)=>{
    if(err){
      console.log("Error Detected.");
      console.log(err);
    }else{
      res.josn({data:flag});
    }
  });
});

module.exports = router;
