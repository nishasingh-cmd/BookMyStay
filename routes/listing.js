const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const {isLoggedIn, validatelisting, isOwner} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

//CREATE
router.get('/new', isLoggedIn, listingController.renderNewForm);

router
.route('/')
//to put the data in db
.post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createNewListing))
//to read all listing
.get(wrapAsync(listingController.index));

//READ

router.get('/:id', wrapAsync(listingController.showListing));

//UPDATE
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.put('/:id', isOwner, upload.single('image'), wrapAsync(listingController.updateListing));
//DELETE
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;