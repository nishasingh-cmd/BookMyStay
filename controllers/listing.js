const Listings = require("../models/listings.js");

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
    const data = new Listings(req.body.listing);
    data.owner = req.user._id;
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
}
module.exports.destroyListing = async(req, res) => {
    const { id } = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}