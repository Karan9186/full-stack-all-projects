const http=require('http')
const fs=require('fs');

let index=fs.readFileSync('index.html','utf-8');
let data=JSON.parse(fs.readFileSync('data.json','utf-8'));
let product=data.products;
const server=http.createServer((req,res)=>{
  if(req.url.startsWith("/products")){
    const id=req.url.split("/")[2];
    const prd=product.find((p)=>p.id==(+id));
    res.setHeader('Content-Type','text/html');
      let modi=index.replace('**ti  tle**',prd.title).replace('**img**',prd.thumbnail).replace('**price**',prd.price).replace('**description**',prd.description);
      res.end(modi);
    return;
  }
  switch(req.url){
    case '/':
      res.setHeader('Content-Type','text/html');
      res.end(index);
      break;
    case '/api':
      res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify(data));
      break;
    case '/product':
      res.setHeader('Content-Type','text/html');
      let modi=index.replace('**title**',product.title).replace('**img**',product.thumbnail).replace('**price**',product.price).replace('**description**',product.description);
      res.end(modi);
      break;

    default:
      res.writeHead(404,"not found");
      res.end();
  }
  // res.setHeader('karan','karan it is me');
  // res.end(index);
})

server.listen(3000)