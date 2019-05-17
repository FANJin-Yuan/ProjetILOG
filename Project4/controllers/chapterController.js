const express = require('express');
const routerChapter = express.Router();
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Chapter = mongoose.model('Chapter');
const Character = mongoose.model('Character');

var chapters = [];
var words = [];



routerChapter.get('/', (req, res) => {
    Chapter.find({}).populate('characters').then(chapters =>{
        res.render("chapter/index.html", {
            viewTitle: "Home",
            chapters: chapters
        }); 
    });
});

routerChapter.post('/dictionnary', async(req, res) => {
    var chapter = new Chapter();
    await Chapter.find((err, chaptersList) => {
        if (!err) 
            chapters = chaptersList;
        else 
            console.log('Error in retrieving chapter list :' + err);
    });
    if(req.body._id == ""){
        chapter = chapters[0];
        Chapter.findById(chapter._id).populate('characters').exec((err, chapter) =>{
            if(!err){
                res.render("chapter/dictionnary.html", {
                    chapters: chapters,
                    chapter: chapter
                });
            }
            else 
                console.log('Error in retrieving chapter list :' + err);
        });
    }
    else{
        chapter._id = req.body._id;
        Chapter.findById(chapter._id).populate('characters').exec( (err, chapter) =>{
            if(!err){
                res.render("chapter/dictionnary.html", {
                    chapters: chapters,
                    chapter: chapter
                });
            }
        });
    }    
});

routerChapter.get('/dictionnary', async(req, res) => {
    var chapter = new Chapter();

    await Chapter.find((err, chapters) => {
        if (!err) {
            chapters = chapters;
        }
        else {
            console.log('Error in retrieving chapter list :' + err);
        }
    });
    chapter = chapters[0];
    Chapter.findById(chapter._id).populate('characters').exec( (err, doc) =>{
        if(!err){
            res.render("chapter/dictionnary.html", {
            chapters: chapters,
            chapter: doc
            });
        }
    });
});

routerChapter.post('/search', async(req, res) =>{
    var chapter = req.body.chapter;
    var character = req.body.character;
    var characters =[];
    await Chapter.find({"name" : {"$regex" : chapter} }).populate('characters').select('characters').exec( (err,chaptersMatching) =>{
        if(!err){
            chaptersMatching.forEach(function(chap){
                var tabChar = chap.characters;
                tabChar.forEach(function(char){
                    var chineseName = char.chineseName;
                    var chinesePhonetic = char.chinesePhonetic;
                    var frenchName = char.frenchName;
                    if(chineseName.includes(character) || chinesePhonetic.includes(character) || frenchName.includes(character)){
                        characters.push(char);
                    }
                });
                
            });
           res.render("chapter/search.html", {
                characters: characters,
                chapterSearched : chapter,
                characterSearched : character
            });
            
        }
        else 
            console.log('Error in retrieving chapter list :' + err);
    });
    
});

module.exports = routerChapter;