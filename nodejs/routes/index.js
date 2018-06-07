var express = require('express');
var router = express.Router();
var login = require("./login");

router.use("/login",login);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('../views/main');
  //res.render("../views/login");
});



module.exports = router;
