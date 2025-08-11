const Listing = require("../models/listing")




module.exports.searchListing = async (req, res) =>{
    let result = req.query.search
if(!result || result.trim() === ""){
    req.flash("error", "Please enter a search term.")
}

  let listing = await Listing.find({
    $or:[
        {location: {$regex: result, $options: "i"}},
        {country: {$regex: result, $options: "i"}}
    ]
  });

  if(!listing.country || listing.location){
    req.flash("error", "No Listing found matching your search.")
  }


  res.render("listings/index.ejs", { allListings: listing });


}