const express = require("express");
const engine = require('ejs-mate');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ExpressError = require("./util/ExpressError.js");
const listing = require("./routes/listing.js")
const reviews = require("./routes/review.js")

app.set("view engine", "ejs");
app.engine('ejs', engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

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

app.use("/listings", listing);
app.use("/listings/:id/review", reviews);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).render("./listings/error.ejs", {message});
})
