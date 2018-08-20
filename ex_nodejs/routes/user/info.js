const express = require('express');
const async = require('async');
const router = express.Router();

router.get('/',function(req,res){
  res.render();
});

router.post('/',function(req,res){

  var arr = [

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
