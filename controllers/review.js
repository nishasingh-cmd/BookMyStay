const Review = require("../models/review.js");
const Listings = require("../models/listings.js");

module.exports.createReview = async(req, res) => {
        const listing = await Listings.findById(req.params.id);
        const newReview = new Review(req.body.reviews);
        newReview.createdBy = req.user._id;
        listing.reviews.push(newReview._id);
        await newReview.save();
        await listing.save();
        req.flash("success", "Review created successfully!");
        res.redirect(`/listings/${req.params.id}`);
}
module.exports.destroyReview = async(req, res) => {
   let { id, reviewId } = req.params;
   await Listings.findByIdAndUpdate(id, {$pull : { reviews : reviewId } });
   await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Review deleted successfully!");
   res.redirect(`/listings/${id}`);
}