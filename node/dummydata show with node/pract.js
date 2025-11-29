const http=require('http')
const fs=require('fs')

const index=fs.readFileSync('index.html','utf-8')
const data=JSON.parse(fs.readFileSync('data.json','utf-8'))
const server=http.createServer((req,res)=>{
if(req.url.startsWith("/product")){
  const id=req.url.split("/")[2]
  const product=data.products.find(p=>p.id===(+id))
  let updInd=index.replace('**title**',product.title).replace('**price**',product.price).replace('**img**',product.thumbnail).replace('**description**',product.description);
  res.end(updInd)
  return;
}
})
server.listen(3000)