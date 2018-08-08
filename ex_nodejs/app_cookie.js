//To use cookie
//npm install cookie-parser --save


var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
app.use(cookieParser());

//ex_1
app.get('/',function(req,res){
  var count;
  if(req.cookies.count){
    count = parseInt(req.cookies.count);
  }else{
    count = 0;
  }
  count++;
  res.cookie('count',count);
  res.send('count = '+req.cookies.count);
});
//ex_1

//ex_2
var products={
  1:{title:'first title'},
  2:{title:'second title'}
};
app.get('/products',function(req,res){
  var output='';
  for(var name in products){
    //console.log(products[name].title);
    output+=`
    <li>
    <a href="/cart/${name}">${products[name].title}</a>
    </li>`
    //res.send(products[name].title);             //<--[Error: Can't set headers after they are sent.] send()는 한번만 나와야한다.
  }
  //res.send('Products');
  res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});
//ex_2

//ex_2_1
app.get('/cart/:no',function(req,res){
  var id=req.params.no;
  var cart;
  if(req.cookies.cart){
    cart=req.cookies.cart;
  }else{
    cart={};
  }
  cart[id]=products[id].title;
  res.cookie('cart',cart);
  res.send(cart);
});
//ex_2_1

//ex_2_2
app.get('/cart',function(req,res){
  var cart=req.cookies.cart;
  var output='';
  if(!cart){
    cart={};
  }else{
    for(var id in cart){
      output+=`<li>${products[id].title}</li>`;
    }
  }
  res.send(`<ul>${output}</ul>`)
});
//ex_2_2

app.listen(3000, function(){
  console.log('Connected 3000 port');
});
