var express = require('express');
var app = express();
app.get('/',function(req,res){
	res.send('Hello Chan\'s Page');
});
app.get('/login',function(req,res){
	res.send('Hello Chan\'s Login Page');
});
app.listen(3000,function(){
	console.log('Conneted 3000 port!');
});
