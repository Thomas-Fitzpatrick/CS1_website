var express = require("express");
var router  = express.Router();
var Submission = require("../models/submission");

router.get("/new", function(req, res) {
    res.render("syllabi/newSubmission");
});

router.post("/", function(req, res){
    Submission.create(req.body.submission, function(err, newSub){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Submission received");
            res.redirect("/submissions/thanks");
        }
    });
});

router.get("/thanks", function(req, res){
    res.render("syllabi/thanks");
});

router.get("/", isLoggedIn, function(req, res) {
    Submission.find({}, function(err, allSubmissions){
        if(err){
            console.log(err);
        } else {
            res.render("admin/submissions", {submissions: allSubmissions});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        req.flash("error ", "You have access to this table");
        return next();
    }
    req.flash("error", "Please Login first");
    res.redirect("/admin");
}


module.exports = router;