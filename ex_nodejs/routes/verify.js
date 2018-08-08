var express = require('express');
var async = require('async');
var router = express.Router();
var jwt = require('jsonwebtoken');
const conf = require('./config/config.js');

router.get('/',function(req,res){


  var token = req.cookies.jwt;
  const secret = conf.secret;
  jwt.verify(token,conf.secret,function(err,decoded){
    if(err){
      res.render('verify',{token:err});
    }else{
      console.log("decoded :",decoded);
      console.log("userId :",decoded.userId);
      res.render('verify',{token:decoded.userId});
    }

  });

});

router.post('/',function(req,res){

});

module.exports = router;
