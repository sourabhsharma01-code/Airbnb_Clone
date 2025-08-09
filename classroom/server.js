// const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = 2000;
const session = require('express-session');
const flash = require('connect-flash')
const path = require('path')

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"))


app.use(session({
    secret: "mysecretstring",
      resave: false,
    saveUninitialized: true
}));
app.use(flash());


app.get("/register", (req, res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name  = name;
    req.flash('success', "user rigistered")
    res.redirect("/help")
})

app.get("/help",(req, res)=>{
    res.locals.messages = req.flash("success")
    res.render("register.ejs",{name: req.session.name});
})


// app.get("/test", (req, res)=>{
//     if(req.session.count){
//         req.session.count++
//     }else{
//         req.session.count = '1'
//     }
//     res.send(`user visit on x time ${req.session.count}`)
// })










// app.use(cookieParser("secretKey"));


// app.get("/greet",(req, res)=>{
//     res.cookie("Country", "India", {signed: true})
//     res.send("greet path")
// });

// app.get("/speak", (req, res)=>{
//     let {name ="anonmyous", surname="anonmyous"} = req.cookies;
//     res.send(`hi my name is ${name}, ${surname}`)
// })




// app.get("/",(req, res)=>{
//     console.dir(req.signedCookies);
    
//     res.send("ROOT")
// })




app.listen(port,()=>{
    console.log(`server listin to port ${port}`);
    
})