
var jwt = require('jsonwebtoken');
const conf = require('./config/config.js');

const secret = conf.secret;

module.exports = function(token){
  var validation=0;
  jwt.verify(token,conf.secret,function(err,decoded){
      if(err){
        validation=0;
      }else{
        validation=1;
      }
      return validation;
    });
};
