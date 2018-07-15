var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
<<<<<<< HEAD
=======
    flash           = require("connect-flash"),
>>>>>>> parent of d500e35... update to most recent version
    passport        = require("passport"),
    LocalStrategy   = require("passport-local");
    
var Syllabus        = require("./models/syllabus"),
    Submission      = require("./models/submission"),
<<<<<<< HEAD
    User            = require("./models/user"),
    seedDB          = require("./seeds");
=======
    User            = require("./models/user");
>>>>>>> parent of d500e35... update to most recent version

// mongoose.connect("mongodb://localhost/CS1_results");
mongoose.connect("mongodb://thomas:rusty@ds137464.mlab.com:37464/cs1_analysis");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));
app.use(flash());

var resultsRoutes   = require("./routes/results"),
    adminRoutes     = require("./routes/admin"),
    submissionRoutes= require("./routes/submissions");


app.use(require("express-session")({
    secret: "This is the first secret I could think of!",
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

<<<<<<< HEAD
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
app.get("/", function(req, res){
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

app.get("/admin", function(req, res) {
    res.render("admin/admin");
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/")
})

app.post("/admin", passport.authenticate("local", {
    successRedirect: "/submissions", 
    failureRedirect: "/admin"
    }), function(req, res){
});

app.get("/submissions/new", function(req, res) {
    res.render("syllabi/newSubmission");
});

app.post("/submissions", isLoggedIn, function(req, res){
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

app.get("/submissions", isLoggedIn, function(req, res) {
    Submission.find({}, function(err, allSubmissions){
        if(err){
            console.log(err);
        } else {
            res.render("admin/submissions", {submissions: allSubmissions});
        }
    });
});

app.get("/results/new", isLoggedIn, function(req, res) {
    res.render("admin/new");
});

app.get("/help", function(req, res){
    res.render("help");
});

app.get("/results/category", function(req, res){
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
app.get("/results/filter", function(req, res){
    
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
=======
app.use("/submissions", submissionRoutes);
app.use("/", adminRoutes);
app.use("/results", resultsRoutes);


// get home page
app.get("/", function(req, res){
    res.render("home");
});


//**********ADD USER**********
// User.register(new User({username: "cs1admin"}), "admin", function(err, user){
//     if(err){
//         console.log(err);
//     }
//     passport.authenticate(("local"));
// }); 
>>>>>>> parent of d500e35... update to most recent version



app.get("*", function(req, res) {
    res.redirect("/");
});


<<<<<<< HEAD
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


// CHECK FOR VALIDITY
app.post("/results", isLoggedIn, function(req, res){
    Syllabus.create(req.body.syllabus, function(err, newSyllabus){
        if(err){
            res.render("admin/new");
        } else {
            res.redirect("syllabi/results")
        }
    });
});


app.get("*", function(req, res) {
    res.redirect("/");
});

=======
>>>>>>> parent of d500e35... update to most recent version
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is runnning");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/admin");
};