const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const Listings = require("../models/listings.js");
const { listingSchema } = require('../listingSchema.js');
const ExpressError = require("../util/ExpressError.js");

const validatelisting = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    }
}

//CREATE
router.get('/new', (req, res) =>{
    res.render("./listings/new.ejs");
})
router.post('/', validatelisting, wrapAsync(async(req, res) => {
    const data = new Listings(req.body.listing);
    await data.save();
    res.redirect("/listings");
}))

//READ
router.get('/', wrapAsync(async (req, res) => {
    const allData = await Listings.find({});
    res.render("./listings/allListing.ejs", {allData})
}))
router.get('/:id', wrapAsync(async(req, res) => {
    const { id } = req.params;
    const data = await Listings.findById(id).populate("reviews");
     if (!data) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("./listings/show.ejs", {data});
}))

//UPDATE
router.get('/:id/edit', wrapAsync(async(req, res) => {
    const { id } = req.params;
    const data = await Listings.findById(id);
    res.render("./listings/edit.ejs", {data})
}))
router.put('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = {
        ...req.body,
        image: {
            url: req.body.image,
            filename: "listingimage"
        }
    };
    await Listings.findByIdAndUpdate(id, updatedData);
    res.redirect(`/listings/${id}`);
}));
//DELETE
router.delete('/:id', wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;