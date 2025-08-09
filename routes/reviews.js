const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const { isLoggedIn } = require('../middleware');

const reviewController = require("../controllers/reviews")






//////REVIEWS REQST
router.post("/:id/reviews", isLoggedIn, wrapAsync(reviewController.createReview));


/////Reviews//////delete route

router.delete("/:id/reviews/:reviewId", wrapAsync(reviewController.destroyReview));


module.exports = router;