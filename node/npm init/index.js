let http=require('http');

const server=http.createServer((req,res)=>{
    res.end("<h1>this is me</h1>");
})

server.listen(3000);