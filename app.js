if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError")
const session = require("express-session");
const MongoStore = require("connect-mongo"); ///earlier we know that the session related details are stored in local memory storage on browser and with the help of this we store the session related info on mongodbatlas database
const connectFlash= require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user")

const listingsRouter = require("./routes/listing")
const reviewsRouter = require("./routes/reviews")
const userRouter = require("./routes/user")
const searchRouter = require("./routes/search")

const dbUrl = process.env.ATLAS_DB


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
main().then((res) => {
    console.log("Database connected");
}).catch((err) => {
    console.log("Database not connected")
})

async function main() {
    // await mongoose.connect(MONGO_URL)
        await mongoose.connect(dbUrl)

}

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"))
app.engine('ejs', ejsMate);


////middleware//

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: "supersecretcode"
    },touchAfter: 24 * 3600,
});


store.on("error",(ERR)=>{
    console.log("ERROR IN MONGO SESSION STORE",ERR );
    
})



const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },

};
// app.get("/", (req, res) => {
//     res.send("root work")
// });



///this middleware to flash new msg through session
app.use(session(sessionOptions));
app.use(connectFlash());

//this middlewre is use to intilize
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser()); ///when user loin store info in the session
passport.deserializeUser(User.deserializeUser());  //fetch the used details form the session id

/////////////////////////////////////////////////////////////////////////




//flash//
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
})


// app.get("/demouser", async (req, res)=>{
//       let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//       });
//       let registerUser = await User.register(fakeUser, "hello");
//       res.send(registerUser)
// })



////Routes//////
app.use('/listings', listingsRouter);
app.use('/listings', reviewsRouter);
app.use("/", userRouter);
app.use("/",searchRouter)












app.use((req, res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next)=>{
    let {status = 500, message="something went wrong"} = err;
    res.status(status).render("error.ejs", {err})
    // res.status(status).send(message);
    
});


const port = 8080;

app.listen(port, () => {
    console.log(`Server Listening to port ${port}`);

});


////CREATE NEW ROUTE TO CREATE LISTING///

// app.post("/listings", wrapAsync(async (req, res, next) => {
//         if(!req.body){
//         throw new ExpressError(400, "Send valid data for listing")
//     }

//         let { title, description, image, price, country, location } = req.body;
//     console.log("form sumbit", req.body);

//     let newListing = new Listing({
//         title, description, image, price, country, location
//     });
//     console.log(newListing);

//     await newListing.save()
//     res.redirect("/listings")
      


// }));



///Test //Listing/////
// app.get("/testListing", async (req, res) => {
//    let sampleListing = new Listing({
//     title: "my new villa",
//     description: "beach",
//     price: 1200,
//     location: "calangta, goa",
//     country: "india"
//    });
//   await sampleListing.save();
//   console.log(sampleListing);

//   console.log("sample was saved");
//   res.send("succesfull testing")

// });
