const express=require('express')
const mongoose=require('mongoose')
const app=express()
const userAction=require('./controller/productController')
const jsonwebtoken=require('jsonwebtoken')

mainConnection().catch((err)=>console.log(err))
async function mainConnection(){
  await mongoose.connect("mongodb://127.0.0.1:27017/karan")
  console.log("connected")
}
app.use(express.json());
app.use(express.urlencoded());

const jwt = require('jsonwebtoken');

app.use((req, res, next) => {
  try {
    const token = req.get('Authorization').split('Bearer ')[1];
    console.log('Token:', token);
    
    if (!token) {
      return res.status(401).send('Access Denied. No token provided.');
    }
    
    var decoded = jwt.verify(token, 'karan');
    console.log('Decoded:', decoded);

    if (decoded.email) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (err) {
    console.error('JWT Verification Error:', err);
    res.status(401).send('Unauthorized');
  }
});

app.post('/create',userAction.createUser).get("/",userAction.getAllUser).get('/user/:id',userAction.getOneUser).delete("/user/:id",userAction.deleteUser).patch("/user/:id",userAction.updateUser).put("/user/:id",userAction.replaceUser).get("/ssruser",userAction.userCreateFile)
app.listen(3000)