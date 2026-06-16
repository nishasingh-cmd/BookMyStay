const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");

router.get("/signup", ((req , res) => {
    res.render("./users/signup.ejs")
}))

router.post("/signup", wrapAsync(async(req , res) => {
    try {
        let { username, email, password } = req.body;
    const newUser = new User( {username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if(err) {
            next(err);
        }  
        req.flash("success", "Registered Successfully!");
        res.redirect("/listings");
    })
    }
    catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}))

router.get("/login", (async(req, res) => {
    res.render("./users/login.ejs")
}))
router.post("/login",
    redirectUrl,
    passport.authenticate("local", {
        failureRedirect : "/login",
        failureFlash : true,
    }),
    async(req, res) => {
    req.flash("success", "Welcome back to BookMyStay!");
    let Url = res.locals.redirectUrl || "/listings"
    res.redirect(Url);
})
router.get("/logout", (req, res, next)=>{
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You're Logged Out Successfully!");
        res.redirect("/listings");
    })
})

module.exports = router;
