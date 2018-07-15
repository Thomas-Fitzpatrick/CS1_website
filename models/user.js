var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

<<<<<<< HEAD
UserSchema.plugin(passportLocalMongoose);
=======
UserSchema.plugin(passportLocalMongoose)
>>>>>>> parent of d500e35... update to most recent version

module.exports = mongoose.model("User", UserSchema);
