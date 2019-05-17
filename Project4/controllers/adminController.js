const express = require('express');
const routerAdmin = express.Router();
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Chapter = mongoose.model('Chapter');
const Character = mongoose.model('Character');
const EventEmitter = require('events').EventEmitter;


var chapters = [];
var words = [];

var event = new EventEmitter();

event.on('action', function(message){
    console.log(message);
});


routerAdmin.get('/', async (req, res) => {
    var action = req.query.action;
    await Chapter.find((err, chaptersList) => {
        if (!err) {
            chapters = chaptersList;
        }
        else {
            console.log('Error in retrieving chapter list :' + err);
        }
    });
    await Character.find((err, wordsList) => {
        if (!err) {
            words = wordsList;
        }
        else {
            console.log('Error in retrieving character list :' + err);
        }
    });
    res.render("chapter/admin.html", {
                chapters: chapters,
                words: words,
                action: action
    });
});


routerAdmin.post('/insertChapter', (req, res) => {
    insertChapter(req, res);
});


routerAdmin.get('/deleteChapter/:id', async(req, res) => {
    await Chapter.findById(req.params.id).exec((err, chapter) =>{
            if(!err){
                var characters = chapter.characters;
                characters.forEach(function(char){
                    event.emit('action', 'deleted Character on Cascade: '+ char.chineseName);
                    Character.deleteOne({ "_id": char._id }).exec();
                });
            }
    });
    await Chapter.findByIdAndRemove(req.params.id, (err, chapter) => {
        if (!err) {
            event.emit('action', 'deleted Chapter: '+ chapter.name);
            res.redirect('/admin/?action=deleted');
        }
        else { console.log('Error in chapter delete :' + err); }
    });
});


routerAdmin.post('/updateChapter', (req, res) => {
    updateChapter(req, res);
});



routerAdmin.post('/insertWord', (req, res) => {
    insertWord(req, res);
});


routerAdmin.get('/deleteWord/:id', async(req, res) => {
    await Character.findByIdAndRemove(req.params.id, (err, char) => {
        if (!err) {
            event.emit('action', 'deleted Word: '+ char.chineseName);
            res.redirect('/admin/?action=deleted');
        }
        else { console.log('Error in chapter delete :' + err); }
    });
});

routerAdmin.post('/updateWord', (req, res) => {
    updateWord(req, res);
});




function insertChapter(req, res) {
    var chapter = new Chapter();
    chapter.name = req.body.name;
    chapter.save((err, chap) => {
        if (!err)
            {
                event.emit('action', 'added Chapter: '+chapter.name);
                res.redirect('/admin/?action=added');
            }
        else {
            console.log('Error during record insertion : ' + err);
        }
    });
}



function updateChapter(req, res) {
    Chapter.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, chap) => {
        if (!err) { 
            event.emit('action', 'updated Chapter '+ req.body._id + ' to ' + req.body.name);
            res.redirect('/admin/?action=updated'); 
        }
        else {
            console.log('Error during record update : ' + err);
        }
    });
}

function insertWord(req, res) {
    var character = new Character();
    character.chineseName = req.body.chineseName;
    character.chinesePhonetic = req.body.chinesePhonetic;
    character.frenchName = req.body.frenchName;
    character.chapterId = req.body.chapterId;


    character.save((err, doc) => {
        if (!err)
            {
                Chapter.findById(req.body.chapterId, (err2, doc) => {
                    if (!err2) {
                        doc.characters.push(character)
                        doc.save();
                        event.emit('action', 'added Word: '+character.chineseName);
                        res.redirect('/admin/?action=added');
                    }
                });
            }
        else {
            console.log('Error during record insertion : ' + err);
        }
    });
}


function updateWord(req, res) {
    Character.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, chap) => {
        if (!err) { 
            event.emit('action', 'updated Word '+ req.body._id + ' to ' + req.body.chineseName + '/' + req.body.chinesePhonetic + '/' + req.body.frenchName);
            res.redirect('/admin/?action=updated'); 
        }
        else {
            console.log('Error during record update : ' + err);
        }
    });
}


module.exports = routerAdmin;
