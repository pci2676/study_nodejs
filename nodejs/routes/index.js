var express = require('express');
var router = express.Router();

//js 파일 경로
var login = require("./login");
var board = require("./board/index");

//보여질 URL, 숨겨진 진짜 경로
router.use("/login",login);
//하위 폴더인 board와 연결해준다.
router.use("/board",board);

//URL의 /를 나타냄
router.get('/', function(req, res, next) {
  //res.render("login");
  res.render("login");
});



module.exports = router;
