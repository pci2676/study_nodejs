const express = require('express');
const async = require('async');
const router = express.Router();
const cookieParser = require('cookie-parser');
const app = express();
const pool = require('./config/db_con');
app.use(cookieParser());

const valid = require('./verify');


router.get('/',function(req,res){

  let arr = [
    (callback)=>{
      const token = req.cookies.jwt;
      let validation_value = valid(token);
      if(validation_value===1){
        callback(null);
      }
      else{
        res.redirect('./login');
      }
    },
    (callback)=>{

    }
  ];


  async.waterfall(arr,(err,result)=>{
    if(err){
      console.log("Error Detected.");
      console.log(err);
    }else{
      console.log(result);
      res.render('./main/main');
    }
  });

});

router.post('/',function(req,res){

  let arr = [

  ];

  async.waterfall(arr,(err,result)=>{
    if(err){
      console.log("Error Detected.");
      console.log(err);
    }else{

    }
  });
});

module.exports = router;
