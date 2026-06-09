const express = require("express");
const engine = require('ejs-mate');
const app = express();

const path = require("path");
app.set("view engine", "ejs");
app.engine('ejs', engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
const methodOverride = require("method-override");
app.use(methodOverride('_method'));

const mongoose = require("mongoose");
const Listings = require("./models/listings.js");
const Review = require("./models/review.js");

const ExpressError = require("./util/ExpressError.js");
const wrapAsync = require("./util/wrapAsync.js");
const {listingSchema, reviewSchema} = require('./listingSchema.js');

const mongo_url = "mongodb://127.0.0.1:27017/BookMyStay"
main().then(() => {
    console.log(`connected to ${mongo_url}`);
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(mongo_url)
}

const port = 8080;
app.listen(port, () => {
    console.log(`server started ${port}`)
})

app.get('/', (req, res) => {
    res.render("./listings/home.ejs");
})
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
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};
//CREATE
app.get('/listings/new', (req, res) =>{
    res.render("./listings/new.ejs");
})
app.post('/listings', validatelisting, wrapAsync(async(req, res) => {
    const data = new Listings(req.body);
    await data.save();
    res.redirect("/listings");
}))

//READ
app.get('/listings', wrapAsync(async (req, res) => {
    const allData = await Listings.find({});
    res.render("./listings/allListing.ejs", {allData})
}))
app.get('/listings/:id', wrapAsync(async(req, res) => {
    const { id } = req.params;
    const data = await Listings.findById(id).populate("reviews");
     if (!data) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("./listings/show.ejs", {data});
}))

//UPDATE
app.get('/listings/:id/edit', wrapAsync(async(req, res) => {
    const { id } = req.params;
    const data = await Listings.findById(id);
    res.render("./listings/edit.ejs", {data})
}))
app.put('/listings/:id', wrapAsync(async (req, res) => {
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
app.delete('/listings/:id', wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
}));
//REVIEW
app.post('/listings/:id/review', validateReview, wrapAsync(async(req, res) => {
        const listing = await Listings.findById(req.params.id);
        const newReview = new Review(req.body.reviews);
        await newReview.save();
        listing.reviews.push(newReview._id);
        await listing.save();
        res.redirect(`/listings/${req.params.id}`);
}));
//DELETE Review
app.delete("/listings/:id/review/:reviewId", wrapAsync(async(req, res) => {
   let { id, reviewId } = req.params;
   await Listings.findByIdAndUpdate(id, {$pull : { reviews : reviewId } });
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
}))
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).render("./listings/error.ejs", {message});
})
