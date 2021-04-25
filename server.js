const express =require('express');
const env =require('dotenv');
const mongoose =require('mongoose');
const bodyParser= require('body-parser');
const User =require('./User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

env.config();
const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dbPath=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_SIFRE}@cluster0.uxlqe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(dbPath, {useNewUrlParser:true}).then(()=>console.log("db connected")).catch(err=>console.log(err))

app.post('/users',async (req, res)=>{
  const {name,email,password}=req.body;
  const hash=await bcrypt.hash(password,10)
  const user2 = new User({ name, email,password:hash });
  const createdUser = await user2.save();
  
  res.status(201).json({ createdUser });
  res.send();
})

app.post('/login',async (req, res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email})
    if (!user){
        res.status(404);
        res.send();
        return;
    }
    const isValid=await bcrypt.compare(password,user.password);
    if (!isValid){
        res.status(403);
        res.send();
        return;
    }
    //מזהה שרת מזהה משתמש
    const token =jwt.sign({userid:user._id.toString(),email:user.email}, 'Aatacr19bp',{expiresIn:'1h'})
    res.json({token,user:{name:user.name,email:user.email,id:user._id.toString()}});
})


app.get('/users',async (req, res)=>{
    if (!req.headers.authorization){
        res.status(403);
        res.send();
        return;
    }
    console.log(req.headers.authorization);
    try{
        const token =req.headers.authorization.split(" ")[1];
        const verify= jwt.verify(token,'Aatacr19bp')
        console.log(verify);
    }catch(err){
        res.status(403);
        res.send();
        return;
    }
    
    const users=await User.find({})
    res.status(200).json({ users });
    res.send();
  })
  

app.listen(process.env.PORT || process.env.SERVER_PORT || 5000);
