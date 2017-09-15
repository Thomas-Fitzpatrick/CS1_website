var express     = require("express");
var router      = express.Router();
var Syllabus    = require("../models/syllabus");
var seedDB      = require("../seeds");
    
var fields = {};

seedDB(function(f){
    fields = f;
});


router.get("/new", function(req, res) {
    res.render("admin/new");
});

//implement router.post() to take form and call getfields again. 

//get results page
router.get("/", function(req, res){
    var language = 'all';
    var country = '';
    var explicitOrScraped = '';
    var syllabusSource = '';
    Syllabus.find({}, function(err, allSyllabi){
        if(err){
            console.log(err);
        } else {
            res.render("syllabi/results", {
                syllabusSource: syllabusSource, 
                language: language, country: country,
                explicitOrScraped:explicitOrScraped,
                fields: fields, syllabi: allSyllabi
            });
        }
    });
});

// querying database for syllabi
router.get("/filter", function(req, res){
    
    var language = req.query.lang;
    var country = req.query.country;
    var explicitOrScraped = req.query.explicitOrScraped;
    var syllabusSource = req.query.source;
    var requirements = {};

    if(language != ""){
        requirements.programmingLanguage = language;
    }
    if(country != ""){
        requirements.country = country;
    }
    if(explicitOrScraped != ""){
        requirements.explicitOrScraped = explicitOrScraped;
    }
    if(syllabusSource != ""){
        requirements.syllabusSource = syllabusSource;
    }
    console.log(requirements);
    Syllabus.find(requirements, function(err, foundSyllabi){
        if(err){
            console.log(err)
        } else {
            res.render("syllabi/results", {
                syllabusSource: syllabusSource,
                language: language, country: country,
                explicitOrScraped: explicitOrScraped, 
                fields: fields, syllabi: foundSyllabi
            })
        }
    });
});


router.get("/:id", function(req, res) {
    Syllabus.findById(req.params.id, function(err, foundSyllabus){
        if(err){
            console.log(err);
        } else {
            res.render("syllabi/show", {syllabus: foundSyllabus});
        }
    });
});

module.exports = router;

