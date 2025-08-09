const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync')
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware");

const listingController = require("../controllers/listings ");

const multer = require("multer");
const { storage } = require('../cloudConfig');

const upload = multer({ storage })    //initilize


////ALL//Listings

///index ROUte///  (1)
router.get("/", wrapAsync(listingController.index));


//// LISTING ROUTEE FORM OPEN TO CERATE LISTING (2)
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show indivisual listing ROUTE///  (3)
router.get("/:id", wrapAsync(listingController.showListing));


//createListing
router.post("/", isLoggedIn,upload.single("image"), wrapAsync(listingController.createListing));


// router.post("/", upload.single("image"), (req, res) => {
//     console.log("esss", req.file);                                //////testing

//     res.send(req.file)
// })



// //edit Route///
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.EditForm));


//////PUt requst ROut after Update the listing
router.put("/:id", isLoggedIn, isOwner,upload.single("image"), wrapAsync(listingController.updateListing));


//Delete ROUTE///
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));




module.exports = router