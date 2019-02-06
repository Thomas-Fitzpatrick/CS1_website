var mongoose = require("mongoose");

var submissionSchema = new mongoose.Schema({
    country: String, 
    url: String, 
    code: String,
    title: String,
    institution: String,
    email: String
});

module.exports = mongoose.model("Submission", submissionSchema);