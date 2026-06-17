const express = require("express");
const router = express.Router({ mergeParams : true });
const Review = require("../models/review.js");
const wrapAsync = require("../util/wrapAsync.js");
const Listings = require("../models/listings.js");
const {validateReview} = require("../middleware.js");

//REVIEW
router.post('/', validateReview, wrapAsync(async(req, res) => {
        const listing = await Listings.findById(req.params.id);
        const newReview = new Review(req.body.reviews);
        await newReview.save();
        listing.reviews.push(newReview._id);
        await listing.save();
        req.flash("success", "Review created successfully!");
        res.redirect(`/listings/${req.params.id}`);
}));
//DELETE Review
router.delete("/:reviewId", wrapAsync(async(req, res) => {
   let { id, reviewId } = req.params;
   await Listings.findByIdAndUpdate(id, {$pull : { reviews : reviewId } });
   await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Review deleted successfully!");
   res.redirect(`/listings/${id}`);
}))

module.exports = router;