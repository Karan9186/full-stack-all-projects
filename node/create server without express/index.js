
const http=require('http');
let data={age:4,
  name:'sai',
}
const server=http.createServer((req,res)=>{
  res.setHeader("karan","its me");
  res.setHeader('Content-Type','text/html');
  res.end(JSON.stringify(data));
  console.log("server created and started");
})

server.listen(3000);