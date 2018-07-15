var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/admin", function(req, res){
    res.render("admin/admin");
});

router.post("/admin", passport.authenticate("local", 
    {
    successRedirect: "/submissions",
    failureRedirect: "/admin"
    }), function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/home");
});


module.exports = router;