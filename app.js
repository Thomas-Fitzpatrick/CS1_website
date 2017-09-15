var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local");
    
var Syllabus        = require("./models/syllabus"),
    Submission      = require("./models/submission"),
    User            = require("./models/user");

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



app.get("*", function(req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is runnning");
});

