const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const {isLoggedIn, validatelisting, isOwner} = require("../middleware.js");

//CREATE
router.get('/new', isLoggedIn, listingController.renderNewForm);

router.post('/', validatelisting, wrapAsync(listingController.createNewListing))

//READ
router.get('/', wrapAsync(listingController.index));

router.get('/:id', wrapAsync(listingController.showListing));

//UPDATE
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.put('/:id', isOwner, wrapAsync(listingController.updateListing));
//DELETE
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;