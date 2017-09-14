var mongoose = require("mongoose");

var submissionSchema = new mongoose.Schema({
    country: String, 
    forMajors: String, 
    url: String
});

module.exports = mongoose.model("Submission", submissionSchema);