const ExpressError = require("./util/ExpressError.js");
const { listingSchema } = require('./listingSchema.js');
const { reviewSchema } = require('./listingSchema.js');
const Listings = require("./models/listings.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Log in to make any changes!");
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl = (req, res, next) => {
    if (req.session.redirectUrl){
       res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.validatelisting = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    }
}

module.exports.isOwner = async (req, res, next )=> {
    let {id} = req.params;
    let data = await Listings.findById(id);
    if(!data.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isCreatedBy = async (req, res, next )=> {
    let {id, reviewId} = req.params;
    let data = await Review.findById(reviewId);
    if(!data.createdBy.equals(res.locals.currUser._id)) {
        req.flash("error", "You did not write this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}