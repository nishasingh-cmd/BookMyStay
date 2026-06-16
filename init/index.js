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
    allData.data = allData.data.map((obj) => ({...obj, owner : "6a31816ef034e3a770f2cbee"}));
    console.log(allData.data[0]);
    await Listings.insertMany(allData.data);
}
initDB();