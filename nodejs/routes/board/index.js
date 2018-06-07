var express = require('express');
var router = express.Router();

//js 파일 경로
var main= require('./main');
var projectView=require('./projectView');
var hobbyView=require('./hobbyView');
var circleView=require('./circleView');
var information = require('./information');

//안드 js경로
var postlist= require('./postlist');


//이게 있으니까 이제 main을 불러올수있음
router.use('/main',main);
router.use('/projectView',projectView);
router.use('/hobbyView',hobbyView);
router.use('/circleView',circleView);
router.use('/information',information);
router.use('/postlist',postlist);

//URL의 /를 나타냄
router.get('/', function(req, res, next) {

});



module.exports = router;
