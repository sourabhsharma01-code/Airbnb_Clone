const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });




///index ROUte///  (1)

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // res.json({allListings})
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author", }
        }).populate("owner");

    if (!listing) {
        req.flash("error", "This listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });

};

module.exports.createListing = async (req, res, next) => {
    if (!req.body) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let response = await geoCodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1,
    })
        .send()
// console.log(response.body.features);
// res.send("done")


    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);

    let newListing = new Listing(req.body); // ✅ Safe way    
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;
   let savedListing =  await newListing.save();
   console.log(savedListing);
   
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
};

// module.exports.createListing = async (req, res, next) => {
//     // if (!req.body) {
//     //     throw new ExpressError(400, "Send valid data for listing");
//     // }

//     let newListing = new Listing(req.body); // ✅ Safe way    
//     newListing.owner = req.user._id;
//     await newListing.save();
//     req.flash("success", "New Listing Created!")
//     res.redirect("/listings");
// };

module.exports.EditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist !")
        return res.redirect("/listings")
    }
    // console.log(listing);
    let OrignaliImageUrl = listing.image.url;
    OrignaliImageUrl = OrignaliImageUrl.replace("/upload/h_300,w_250")


    res.render("listings/edit.ejs", { listing, OrignaliImageUrl });
};

module.exports.updateListing = async (req, res) => {
    // if (!req.body) {
    //     throw new ExpressError(400, "Send valid data for listing")
    // }


    let { id } = req.params;
    let { title, description, image, price, country, location } = req.body;

    let listing = await Listing.findByIdAndUpdate(id, { title, description, image, price, country, location }, { new: true, runValidators: true });
    console.log(listing);

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save()
    }


    req.flash("success", "Listing Succesfully Updated!");


    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let distroy = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Successfully Deleted");
    console.log("listing deleted", distroy);
    res.redirect("/listings");


};