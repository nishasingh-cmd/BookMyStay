const express = require("express");
const router = express.Router({ mergeParams : true });
const Review = require("../models/review.js");
const ExpressError = require("../util/ExpressError.js");
const wrapAsync = require("../util/wrapAsync.js");
const Listings = require("../models/listings.js");
const { reviewSchema } = require('../listingSchema.js');

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

//REVIEW
router.post('/', validateReview, wrapAsync(async(req, res) => {
        const listing = await Listings.findById(req.params.id);
        const newReview = new Review(req.body.reviews);
        await newReview.save();
        listing.reviews.push(newReview._id);
        await listing.save();
        res.redirect(`/listings/${req.params.id}`);
}));
//DELETE Review
router.delete("/:reviewId", wrapAsync(async(req, res) => {
   let { id, reviewId } = req.params;
   await Listings.findByIdAndUpdate(id, {$pull : { reviews : reviewId } });
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
}))

module.exports = router;