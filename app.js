//jshint esversion:6
const express=require("express");
const app=express();
const  ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const md5=require("md5")
const { passwordStrength } = require('check-password-strength')
var MailChecker = require('mailchecker');

mongoose.connect("mongodb://127.0.0.1:27017/final")

const userschema=new mongoose.Schema({
   email:String,
   password:String,
   name:String,
   numbere:String,
   about:String,
   codechef:String,

})


const User=new mongoose.model("model",userschema)
app.use(express.static("public"))
app.set("view engine",'ejs');
app.use(
    bodyParser.urlencoded({
        extended:true
    })
)
app.get("/",function(req,res){
    res.render("homepage")
})
app.get("/login",function(req,res){

    res.render("home",{data:0})
    

})
app.get("/detailreg",function(req,res){
    res.render("detail",)
})


app.get("/register",function(req,res){
    res.render("register",{data:0})
})
app.get("/render/:name",function(req,res){
    User.findOne({numbere:req.params.name},function(err,founduser){
        res.render("dashboard",{founduser:founduser})
    })
    
})
app.post("/after",function(req,res){
    res.render("dashboard");
})

app.post("/register",(req,res)=>{
   
    const username=req.body.username;
    User.findOne({email:username},function(err,founduser){
        if(founduser){
            res.render("register",{data:1})
        }
        
    else if(!MailChecker.isValid(username)){
        res.render("register",{data:4})
    }
            
        
        else if(passwordStrength(req.body.password).value=="Too weak"){
            res.render("register",{data:3})
        }
        else if(md5(req.body.password)!=md5(req.body.confirm)){
            res.render("register",{data:2})
        }
        else{
            
            User.count({
               
                "active": true, 
                "status": { "$in": [0, 1] }
            }, function(err, count) {
                if(err){
                    console.log(err);
                } 
                else{
            const newuser=new User({
                email:req.body.username,
                password:md5(req.body.password),
                name:req.body.name,
                numbere:++count,
                about:req.body.about,
                codechef:req.body.codechef
            
            })
            newuser.save(function(err){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect("/login")
                }
            })}})
        }
    })
   
})
app.post("/login",(req,res)=>{
    
 const username=req.body.username
   console.log(username);
   const pass=md5(req.body.password) ;
   User.findOne({email:username},function(err,founduser){
   
    if(err){

        console.log(err)
    }
    else if(!founduser){
        res.render("home",{data:2})
    }

    else{
        console.log(founduser.password)
        console.log(pass)
        console.log(founduser)
        if(founduser){
            if(founduser.password===pass){
                const name=founduser.numbere
                console.log(name);
                res.redirect(`/render/${name}`)
            }
            else{
               
                res.render("home",{data:1})
                
            }
            
        
        }

        
    }
   })
})




   



app.listen(3000,()=>{
    console.log("app is listen");
})