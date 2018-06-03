//nodejs에서 제공하는 'http'라는 이름의 모듈을 가져와서 http에 담아 놓은 것 이다.
//모듈의 자세한 설명은 nodejs의 DOCS에서 확인 할 수 있다.
const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

// http.createServer((req, res) => {
//  res.writeHead(200, { 'Content-Type': 'text/plain' });
//  res.end('Hello World\n');
// }).listen(port, hostname, () => {
//  console.log(`Server running at http://${hostname}:${port}/`);
// });

var server = http.createServer(function(req,res){
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});
server.listen(port,hostname,function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
