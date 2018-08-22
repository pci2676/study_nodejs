const express = require('express');
const async = require('async');
const router = express.Router();
const pool = require('./config/db_con');

const pbkdf2Password = require('pbkdf2-password');
const hasher= pbkdf2Password();
const phone_hasher = pbkdf2Password({keyLength:10});

const nodemailer = require('nodemailer');
const config = require('./config/config');
let transporter = nodemailer.createTransport(config.transport);


router.get('/',function(req,res){
  res.render('join');
});

router.post('/',function(req,res){

  const query="INSERT INTO users values(?,?,?,?,?,?)";

  const userEmail=req.body.userEmail;
  const userName=req.body.userName;
  const userPhone=req.body.userPhone;

  var arr=[
    (callback)=>{
      hasher({password:req.body.userPass},function(err,pass,salt,hash){
        if(err){
          callback("Hashing Error :",err);
        }else{
        const userPass=hash;
        const userSalt=salt;
        callback(null,userPass,userSalt);
      }
      });
  },
    (userPass,userSalt,callback)=>{
      pool.getConnection((err,connection)=>{
        if(err){
          res.status(500).send({
            status:false,
            msg:"DB Connection Fail"
          });
          connection.release();
          callback("DB Connection Fail : "+err);
        }else{
          callback(null,connection,userPass,userSalt);
        }
      });
    },
    (connection,userPass,userSalt,callback)=>{
      connection.query(query,[userEmail,userName,userPass,userSalt,userPhone,'false'],function(err,rows){
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
              callback(null);
            }
          });
        }
      });
    },
    (callback)=>{
      //인증 이메일에 쓰일 토큰으로 userEmail을 사용하고 그에 해당하는 salt는 userPhone으로 한다.
      phone_hasher({password:userEmail,salt:userPhone},function(err,pass,salt,hash){
        if(err){
          callback("Hashing Error2 :",err);
        }else{
        callback(null,hash);
      }
      });
    },
    (email,callback)=>{

      const context="<a href='"+"http://localhost:3000/auth?email="+userEmail+"&token="+email+"'>인증하기</a>";
      let mailOptions = {
        from:'pci2676@gmail.com',
        to:userEmail,
        subject:'인증메일입니다.',
        html:context
      };

      transporter.sendMail(mailOptions,function(err,info){
        if(err){
          callback("Mailing Error : "+err);
        }else{
          console.log("Mailing Success.");
          callback(null,true);
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
