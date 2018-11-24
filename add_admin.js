var express = require("express"),
        app = express(),
        mongoose = require("mongoose"),
        passport = require("passport"),
        LocalStrategy = require("passport-local");

var     User = require("./models/user");

mongoose.connect("mongodb://localhost/CS1_results");

var newUser = new User({username: "thomas"});
User.register(newUser, "admin", function(err, user){
        if(err){
                console.log(err);
                return res.render("home");
        }
});
