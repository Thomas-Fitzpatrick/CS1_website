var mongoose    = require("mongoose"),
    Syllabus    = require("./models/syllabus");
    
    
var manEntries      = require("./db_sources/Manual_LO.json");
var citidelEntries  = require("./db_sources/CITIDEL_LO.json");

var allEntries = manEntries.concat(citidelEntries);
    
function seedDB(callback){  
    
    var fields = {};
    Syllabus.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds");
        
        var count = 0;
        allEntries.forEach(function(seed_syllabus){
            var chomped_languages = [];
            seed_syllabus.programmingLanguage.forEach(function(lang){
                chomped_languages.push(lang.trim());
            });
            seed_syllabus.languages = chomped_languages;
            
            seed_syllabus.country = seed_syllabus.country.trim();
                
            Syllabus.create(seed_syllabus, function(err, data){
                count += 1;
                if(err){
                    console.log(err);
                } else {
                    
                }
                if(count === allEntries.length){
                    getAvailableFields(function(fields){
                        callback(fields);
                    });
                }
            });
        });
        
    });  
}

function getAvailableFields(callback){
    var fields = {
        languages: [], 
        countries: [],
        categories: []
    };
    
    Syllabus.collection.distinct("country", function(error, results){
        if(error){
            console.log(error);
        } else {
            fields.countries =  results;
            Syllabus.collection.distinct("LOCategories", function(error, results){
                if(error){
                    console.log(error);
                } else {
                    fields.categories =  results;
                    Syllabus.collection.distinct("programmingLanguage", function(error, results){
                        if(error){
                            console.log(error);
                        } else {
                            fields.languages = results;
                            callback(fields);
                        }
                    });
                }
            });
        }
    });
   
}
module.exports = seedDB;
