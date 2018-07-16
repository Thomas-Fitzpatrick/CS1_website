var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose");
    
var Syllabus        = require("./models/syllabus"),
    Submission      = require("./models/submission"),
    seedDB          = require("./seeds");

mongoose.connect("mongodb://localhost/CS1_results");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));

    
var fields = {};
seedDB(function(f){
    fields = f;
});

// get home page
app.get("/", function(req, res){
    console.log(fields);
    res.render("home");
});

app.get("/admin", function(req, res) {
    res.render("admin/admin");
});

app.post("/admin", function(req, res){
    if(req.body.login === "CS1" && req.body.password === "12345"){
        res.redirect("/submissions");
    } else {
        res.redirect("admin");
    }
});

app.get("/submissions/new", function(req, res) {
    res.render("syllabi/newSubmission");
});

app.post("/submissions", function(req, res){
    Submission.create(req.body.submission, function(err, newSub){
        if(err){
            console.log(err);
        } else {
            res.redirect("/submissions/thanks");
        }
    });
});

app.get("/submissions/thanks", function(req, res){
    res.render("syllabi/thanks");
});

app.get("/submissions", function(req, res) {
    Submission.find({}, function(err, allSubmissions){
        if(err){
            console.log(err);
        } else {
            res.render("admin/submissions", {submissions: allSubmissions});
        }
    });
});

app.get("/results/new", function(req, res) {
    res.render("admin/new");
});


app.get("/help", function(req, res){
    res.render("help");
});

app.get("/results/category/:category", function(req, res){
    res.render("syllabi/category");
});

// querying database for syllabi
app.get("/results/filter", function(req, res){
    
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



app.get("/results/:id", function(req, res) {
    Syllabus.findById(req.params.id, function(err, foundSyllabus){
        if(err){
            console.log(err);
        } else {
            res.render("syllabi/show", {syllabus: foundSyllabus});
        }
    });
});


//get results page
app.get("/results", function(req, res){
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
                fields: fields, syllabi: allSyllabi});
        }
    });
});


// app.get("*", function(req, res) {
//     res.redirect("/");
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is runnning");
});

