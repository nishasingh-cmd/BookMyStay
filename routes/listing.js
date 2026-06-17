const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const Listings = require("../models/listings.js");
const {isLoggedIn, validatelisting, isOwner} = require("../middleware.js");

//CREATE
router.get('/new', isLoggedIn, (req, res) =>{
    res.render("./listings/new.ejs");
})
router.post('/', validatelisting, wrapAsync(async(req, res) => {
    const data = new Listings(req.body.listing);
    data.owner = req.user._id;
    await data.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}))

//READ
router.get('/', wrapAsync(async (req, res) => {
    const allData = await Listings.find({});
    res.render("./listings/allListing.ejs", {allData})
}))
router.get('/:id', wrapAsync(async(req, res) => {
    const { id } = req.params;
    const data = await Listings.findById(id)
    .populate("reviews")
    .populate("owner");
     if (!data) {
        req.flash("error", "Listing you requested for does not exits");
        return res.redirect("/listings");
    }
    console.log(data);
    res.render("./listings/show.ejs", {data});
}))

//UPDATE
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const data = await Listings.findById(id);
    if (!data) {
        req.flash("error", "Listing you requested for does not exits");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", {data})
}))
router.put('/:id', isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = {
        ...req.body,
        image: {
            url: req.body.image,
            filename: "listingimage"
        }
    };
    await Listings.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));
//DELETE
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;