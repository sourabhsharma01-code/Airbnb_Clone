const Listing = require("./models/listing")

const isLoggedIn = (req, res, next)=>{
    console.log(req.user);
    
     if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be login first to create listing!")
        return res.redirect("/login")
    }
    next();
}

const saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}


const isOwner = async (req, res, next)=>{
     let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!(res.locals.currUser && listing.owner && listing.owner._id.equals(res.locals.currUser._id))) {
    req.flash("error", "You are not the owner of this listings");
    return res.redirect(`/listings/${id}`);
}
next()

}




module.exports = {isLoggedIn,  saveRedirectUrl, isOwner };