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
    await Chapter.find((err, chapters) => {
        if (!err) {
            chapters = chapters;
        }
        else {
            console.log('Error in retrieving chapter list :' + err);
        }
    });
    await Character.find((err, words) => {
        if (!err) {
            words = words;
        }
        else {
            console.log('Error in retrieving character list :' + err);
        }
    });
    res.render("chapter/admin.html", {
                viewTitle: "Panel Admin",
                chapters: chapters,
                words: words,
                action: action
    });
});






routerAdmin.post('/insertWord', (req, res) => {
    insertWord(req, res);
});


routerAdmin.get('/deleteWord/:id', async(req, res) => {
    await Character.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/admin/?action=deleted');
        }
        else { console.log('Error in chapter delete :' + err); }
    });
});

routerAdmin.post('/updateWord', (req, res) => {
    updateWord(req, res);
});





routerAdmin.post('/insertChapter', (req, res) => {
    insertChapter(req, res);
});


routerAdmin.get('/deleteChapter/:id', async(req, res) => {
    await Character.deleteMany({"chapterId":req.params.id}).exec();
    await Chapter.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/chapter/admin/?action=deleted');
        }
        else { console.log('Error in chapter delete :' + err); }
    });
});


routerAdmin.post('/updateChapter', (req, res) => {
    updateChapter(req, res);
});



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

                    }
                });
                res.redirect('/?action=added');
            }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("admin", {
                    viewTitle: "Admin Panel",
                    chapter: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}


function updateWord(req, res) {
    Character.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('admin/?action=updated'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("chapter/addOrEdit", {
                    viewTitle: 'Update Chapter',
                    chapter: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}







function insertChapter(req, res) {
    var chapter = new Chapter();
    chapter.name = req.body.name;
    chapter.save((err, doc) => {
        if (!err)
            {
                event.emit('addedWord', 'added Chapitre: '+chapter.name);
                res.redirect('/admin/?action=added');
            }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("admin", {
                    viewTitle: "Admin Panel",
                    chapter: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}



function updateChapter(req, res) {
    Chapter.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('admin/?action=updated'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("chapter/addOrEdit", {
                    viewTitle: 'Update Chapter',
                    chapter: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}



function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['fullNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = routerAdmin;
