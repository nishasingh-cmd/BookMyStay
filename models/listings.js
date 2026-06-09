const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    url: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=1170&auto=format&fit=crop",
      set: (v) =>
        v === ""
          ? "https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=1170&auto=format&fit=crop"
          : v,
    },
    filename: {
      type: String,
      default: "listingimage",
    },
  },

  price: Number,
  location: String,
  country: String,
  reviews : [{
    type : Schema.Types.ObjectId,
    ref : "Review",
  }]
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
    await Review.deleteMany({_id : { $in : listing.reviews}})
  }
})


const Listings = mongoose.model("Listings", listingSchema);
module.exports = Listings;