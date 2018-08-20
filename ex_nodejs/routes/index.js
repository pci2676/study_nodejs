var express = require('express');
var router = express.Router();

var login = require('./login');
router.use('/login',login); //첫번째 인자가 보여지는 경로, 두번째 인자가 숨겨진 실제 경로
var join = require('./join');
router.use('/join',join);
var verify=require('./verify');
router.use('/verify',verify);
var duplicate_id=require('./duplicate_id');
router.use('/duplicate_id',duplicate_id);

//email 인증
var auth = require('./auth/verify_email');
router.use('/auth',auth);

//메인페이지
var main = require('./main');
router.use('/main',main);

/* GET home page. */
router.get('/', function(req, res,next) {
  res.render('login');
});

module.exports = router;
