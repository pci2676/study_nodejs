//projectView.ejs를 렌더링 해준다.
var express = require('express');
var async = require('async');
var router = express.Router();
//js 파일 경로

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query);
    res.render('circleView');
});

module.exports = router;
