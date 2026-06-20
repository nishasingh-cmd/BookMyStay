const Listings = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allData = await Listings.find({});
    res.render("./listings/allListing.ejs", {allData})
}
module.exports.renderNewForm = (req, res) =>{
    res.render("./listings/new.ejs");
}
module.exports.showListing = async(req, res) => {
    const { id } = req.params;
    const data = await Listings.findById(id)
    .populate({
        path : "reviews", 
        populate : {path : "createdBy"}
    })
    .populate("owner");
     if (!data) {
        req.flash("error", "Listing you requested for does not exits");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {data});
}
module.exports.createNewListing = async(req, res) => {
    let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send();
    let url = req.file.path;
    let filename = req.file.filename;
    const data = new Listings(req.body.listing);
    data.owner = req.user._id;
    data.image = {url, filename};
    data.geometry = response.body.features[0].geometry;
    await data.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}
module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const data = await Listings.findById(id);
    if (!data) {
        req.flash("error", "Listing you requested for does not exits");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", {data})
}
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename,};
        await listing.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    const { id } = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}