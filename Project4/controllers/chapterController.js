//Import des constantes et modèles utiles au Controller
const express = require('express');
const routerChapter = express.Router();
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Chapter = mongoose.model('Chapter');
const Character = mongoose.model('Character');

//Arrays définis globaux utilisés pour stocker les Objets et renvoyer les vues avec ceux-ci passés en paramètres
var chapters = [];
var words = [];


//Renvoie la page affichant les chapitres (url : ip/chapters)
routerChapter.get('/', (req, res) => {
    Chapter.find((err, chaptersList) => {
        if (!err) {
            res.render("chapter/index.html", {
            chapters: chaptersList
            });
        }
        else 
            console.log('Error in retrieving chapter list :' + err);
    });
});

//Renvoie la page affichant les chapitres (url : ip/chapters/dictionnary)
routerChapter.post('/dictionnary', async(req, res) => {
    var chapter = new Chapter();
    await Chapter.find((err, chaptersList) => {
        if (!err) 
            chapters = chaptersList;
        else 
            console.log('Error in retrieving chapter list :' + err);
    });
    //Si la requête n'a pas d'id, c'est à dire que si le page n'a pas était chargée via l'index, alors on affichera le premier chapitre
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

//Si la requête n'a pas d'id, c'est à dire que si le page n'a pas était chargée via l'index, alors on affichera le premier chapitre
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

//Renvoie la page search filtrée par les paramètres envoyés par la requête POST
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