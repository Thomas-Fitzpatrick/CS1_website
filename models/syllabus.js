var mongoose = require("mongoose");

var syllabusSchema = new mongoose.Schema({
    courseID: String,
    country: String,
    uniName: String,
    courseCode: String,
    courseName: String,
    syllabusDate: String,
    syllabusSource: String,
    associatedDegrees: String,
    prerequisites: String,
    forMajors: String,
    courseStage: String,
    courseSemester: String,
    programmingLanguage: [String],
    instructionLanguage: String,
    url: String,
    explicitOrScraped: String,
    learningOutcomes: [String],
    LOCategories: [String]
});

module.exports = mongoose.model("Syllabus", syllabusSchema);