var express = require('express');
var path = require('path');
var app = express();

var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit:10,
  host :'localhost',
  user:'root',
  password:'',
  database:'inu_hackathon',
  debug:false
});

//사용자를 등록하는 함수
var addUser = function (id,name,grade,major,subMajor,phone,email,callback) {
  console.log('addUser 호출.');

  //커넥션 풀에서 연결 객체를 가져온다.
  pool.getConnection(function (err,conn) {
      if(err){
        conn.release();
        return;
      }
      console.log('데이터베이스 연결 스레드 아이디 :'+conn.threadId);

      //데이터를 객체로 만든다.

      var data={id:id,name:name,grade:grade,major:major,subMajor:subMajor,phone:phone,email:email};

      //SQL문을 실행
      var exec = conn.query('insert into users set ?',data,function (err,result) {
        conn.release();
        console.log('실행 대상 SQL : ',exec.sql);

        if(err){
          console.log('SQL 실행 시 오류 발생');
          console.dir(err);

          callback(err.null);

          return;
        }
        callback(null,result);
      });
  });
};

//express에게 ejs를 view engine 으로 사용 할 것을 알린다.
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + 'public')));
var data={count:0};
app.get('/',function(req,res){
  data.count++;
  res.render('my_first_ejs');
});

app.get('/reset',function (req,res) {
    data.count=0;
});

app.listen(3000, function() {

  console.log('Server on.');
});
