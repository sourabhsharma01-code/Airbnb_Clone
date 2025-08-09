const Listing = require("../models/listing");
const Review =  require("../models/review");


//create functionality

module.exports.createReview = async (req, res) => {
  console.log("REQ.BODY:", req.body);  // 👈 debug here
  let { id } = req.params;
  let { review } = req.body

  if (!review || !review.comments || review.comments.trim() === " ") {
    req.flash("error", "Please enter a comment in your review");
    return res.redirect(`/listings/${id}`);
  }

  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id
  console.log(newReview);
  
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review Added!")
  res.redirect(`/listings/${listing._id}`)

};

//delete functionality
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let revid = await Review.findByIdAndDelete(reviewId)
  let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  console.log("form review", revid);
  console.log("listingreview", listing); 4
  req.flash("success", "Review Deleted!")


  res.redirect(`/listings/${id}`); // just to complete the request


};