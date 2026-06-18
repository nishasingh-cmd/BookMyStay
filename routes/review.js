const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../util/wrapAsync.js");
const Listings = require("../models/listings.js");
const {validateReview, isLoggedIn, isCreatedBy} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//REVIEW
router.post('/', validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//DELETE Review
router.delete("/:reviewId", isLoggedIn, isCreatedBy, wrapAsync(reviewController.destroyReview))

module.exports = router;