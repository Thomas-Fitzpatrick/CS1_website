var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    fs              = require("fs");
    
var Syllabus        = require("./models/syllabus"),
    Submission      = require("./models/submission"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    // allEntries      = require("./db_sources/current_state.json");
    



mongoose.connect("mongodb://localhost/CS1_results");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));
    
var fields = {};
seedDB(function(f){
    fields = f;
});

//Passport config
app.use(require ("express-session")({
    secret: "What are CS1 students learning?",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

// get home page
app.get("/sigcse2019/", function(req, res){
    console.log(fields);
    // var newUser = new User({username: "admin"});
    // User.register(newUser, "12345", function(err, user){
    //     if(err){
    //         console.log(err);
    //         return res.render("home");
    //     }
    // });
    res.render("home");
});

app.get("/sigcse2019/csv", function(req, res) {
    Syllabus.find().lean().exec(function (err, syllabi) {
        if (err) {
            console.log(err)
        } else {
            return res.end(JSON.stringify(syllabi));
        }
    });
});

app.get("/sigcse2019/admin", function(req, res) {
    res.render("admin/admin");
});

app.get("/sigcse2019/logout", function(req, res){
    req.logout();
    res.redirect("/sigcse2019/")
})

app.post("/sigcse2019/admin", passport.authenticate("local", {
    successRedirect: "/sigcse2019/submissions", 
    failureRedirect: "/sigcse2019/admin"
    }), function(req, res){
});

app.get("/sigcse2019/submissions/new", function(req, res) {
    res.render("syllabi/newSubmission");
});

app.post("/sigcse2019/submissions", function(req, res){
    Submission.create(req.body.submission, function(err, newSub){
        if(err){
            console.log(err);
        } else {
            res.redirect("/sigcse2019/submissions/thanks");
        }
    });
});

app.get("/sigcse2019/submissions/thanks", function(req, res){
    res.render("syllabi/thanks");
});

app.get("/sigcse2019/submissions", isLoggedIn, function(req, res) {
    Submission.find({}, function(err, allSubmissions){
        if(err){
            console.log(err);
        } else {
            res.render("admin/submissions", {submissions: allSubmissions});
        }
    });
});

app.get("/sigcse2019/results/new", isLoggedIn, function(req, res) {
    res.render("admin/new");
});

app.get("/sigcse2019/help", function(req, res){
    res.render("help");
});

app.get("/sigcse2019/results/category", function(req, res){
    var category = req.query.category;
    var language = req.query.lang;
    var country = req.query.country;
    var explicitOrScraped = req.query.explicitOrScraped;
    var syllabusSource = req.query.source;
    var requirements = {};
    console.log("c" + category);
    console.log("l" + language);
    console.log("c" + country);
    console.log("e" + explicitOrScraped);
    console.log("s" + syllabusSource);

    if(category != ""){
        requirements.LOCategories = category;
    }
    if(language != "all" && language != ""){
        requirements.programmingLanguage = language;
    }
    if(country != ""){
        requirements.country = country;
    }
    if(explicitOrScraped != ""){
        requirements.explicitOrScraped = explicitOrScraped;
    }
    if(syllabusSource != "" ){
        requirements.syllabusSource = syllabusSource;
    }
    console.log(requirements);
    
    Syllabus.find(requirements, function(err, foundSyllabi){
        if(err){
            console.log(err)
        } else {
            res.render("syllabi/category", {
                category: category, syllabusSource: syllabusSource,
                language: language, country: country,
                explicitOrScraped: explicitOrScraped, 
                syllabi: foundSyllabi
            })
        }
    });

});

// querying database for syllabi
app.get("/sigcse2019/results/filter", function(req, res){
    
    var language = req.query.lang;
    var country = req.query.country;
    var explicitOrScraped = req.query.explicitOrScraped;
    var syllabusSource = req.query.source;
    var requirements = {};
    console.log("l" + language);
    console.log("c" + country);
    console.log("e" + explicitOrScraped);
    console.log("s" + syllabusSource);

    
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



app.get("/sigcse2019/results/:id", function(req, res) {
    Syllabus.findById(req.params.id, function(err, foundSyllabus){
        if(err){
            console.log(err);
        } else {
            res.render("syllabi/show", {syllabus: foundSyllabus});
        }
    });
});


//get results page
app.get("/sigcse2019/results", function(req, res){
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


// CHECK FOR VALIDITY
app.post("/sigcse2019/results", isLoggedIn, function(req, res){

    Syllabus.create(req.body.syllabus, function(err, newSyllabus){
        if(err){
            res.render("admin/new");
        } else {
            
            Syllabus.find().lean().exec(function (err, syllabi) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("found all syllabi");
                    
                    fs.writeFile("./db_sources/current_state.json", JSON.stringify(syllabi), function(err) {
                        if(err) {
                            return console.log(err);
                        }
                        console.log("The file was saved!");
                        res.redirect("/sigcse2019/syllabi/results")
                    }); 
                }
            });    
            
            
        }
    });
});

app.get("/sigcse2019/*", function(req, res) {
    res.redirect("/sigcse2019/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is runnning");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/sigcse2019/admin");
};