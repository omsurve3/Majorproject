const express =require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(cookieParser("secretcode"));

const sessionOptions = {secret:"mysupersecretstring",resave:false,saveUninitialized:true}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
next();
})

app.get("/test",(req,res)=>{
    res.send("test successful");
})

app.get("/register",(req,res)=>{
    let {name="anonymus"} = req.query;
    req.session.name =name;
    
    if(name=="anonymus"){
    req.flash("error","user not registered");

    }else{
        req.flash("success","user registered successfully");
    }
    res.redirect("/hello");
    
 })

 app.get("/hello",(req,res)=>{
 
    res.render("page.ejs",{name: req.session.name});
 })

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//     req.session.count=1;
//  }
//     res.send(`You sent a req ${req.session.count} times`);
// })


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})