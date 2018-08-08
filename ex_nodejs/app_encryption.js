var express = requrie('express');
var http = require('http');
var pbkdf2Password = require('pbkdf2-password');
var hasher= pbkdf2Password();

var opts= {
  password:"myPassword", //사용자의 비밀번호
  salt:'mySalt' //사용자 비밀번호의 salt값
};
//if('사용자아이디'==='입력한아이디'){
hasher(opts,function(err,pass,salt,hash){
  if(hash===password){
    //hash : 입력한 패스워드가 해시된 값
    //password : db에 저장되어있는 사용자의 비밀번호 값
  }else{
    //비밀번호가 틀렸을떼
  }
});
//} //endOfIf
