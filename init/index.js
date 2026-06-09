const mongoose = require("mongoose");
const Listings = require("../models/listings.js");
const allData = require("./data.js");
const mongo_url = "mongodb://127.0.0.1:27017/BookMyStay";
main().then(() => {
    console.log(`connected to ${mongo_url}`);
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(mongo_url);
}
 
const initDB = async () => {
    await Listings.deleteMany({});
    await Listings.insertMany(allData.data);
}
initDB();