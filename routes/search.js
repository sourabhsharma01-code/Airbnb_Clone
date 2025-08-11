const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search");
const wrapAsync  = require("../utils/wrapAsync")


router.get("/search",wrapAsync(searchController.searchListing));

module.exports = router