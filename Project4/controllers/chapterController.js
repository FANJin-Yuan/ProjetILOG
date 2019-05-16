const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Chapter = mongoose.model('Chapter');
const Character = mongoose.model('Character');

var EventEmitter = require('events').EventEmitter;

var event = new EventEmitter();

event.on('addedWord', function(message){
    console.log(message);
});



mongoose.set('useFindAndModify', false);

var chapters = [];
var words = [];

router.get('/', async (req, res) => {

    Chapter.find({}).populate('characters').then(chapters =>{
        res.render("chapter/index.html", {
        viewTitle: "Home",
        chapters: chapters

    }); 
});
});

router.post('/dictionnary', async(req, res) => {
    var chapter = new Chapter();

    await Chapter.find((err, docs) => {
        if (!err) {
            chapters = docs;
        }
        else {
            console.log('Error in retrieving chapter list :' + err);
        }
    });

    if(req.body._id == ""){
        chapter = chapters[0];
        Chapter.findById(chapter._id).populate('characters').exec( (err, doc) =>{

            if(!err){
                res.render("chapter/dictionnary.html", {
                chapters: chapters,

                chapter: doc

            });
            }
        });
    }
    else{
        chapter._id = req.body._id;
        Chapter.findById(chapter._id).populate('characters').exec( (err, doc) =>{

            if(!err){
                res.render("chapter/dictionnary.html", {
                chapters: chapters,
                chapter: doc
            });
            }
        });
    }    
});

router.get('/dictionnary', async(req, res) => {
    var chapter = new Chapter();

    await Chapter.find((err, docs) => {
        if (!err) {
            chapters = docs;
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

router.post('/insertWord', (req, res) => {
    var id = req.body.chapterId;
    insertWord(req, res, id);
});

router.post('/updateWord', (req, res) => {
    updateWord(req, res);
});

router.post('/updateChapter', (req, res) => {
    updateChapter(req, res);
});

router.post('/insertChapter', (req, res) => {
    insertChapter(req, res);
});



router.get('/admin', async (req, res) => {
    var action = req.query.action;
    await Chapter.find((err, docs) => {
        if (!err) {
            chapters = docs;
        }
        else {
            console.log('Error in retrieving chapter list :' + err);
        }
    });
    await Character.find((err, docs) => {
        if (!err) {
            words = docs;
        }
        else {
            console.log('Error in retrieving chapter list :' + err);
        }
    });
    res.render("chapter/admin.html", {
                viewTitle: "Panel Admin",
                chapters: chapters,
                words: words,
                action: action
    });
});




router.get('/update/:id', (req, res) => {
    Chapter.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("chapter/addOrEdit", {
                viewTitle: "Update Chapter",
                chapter: doc
            });
        }
    });
});


router.get('/deleteChapter/:id', async(req, res) => {
    await Character.deleteMany({"chapterId":req.params.id}).exec();
    await Chapter.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/chapter/admin/?action=deleted');
        }
        else { console.log('Error in chapter delete :' + err); }
    });
});

router.get('/deleteWord/:id', async(req, res) => {
    await Character.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/chapter/admin/?action=deleted');
        }
        else { console.log('Error in chapter delete :' + err); }
    });
});

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

function insertWord(req, res, id) {
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
                res.redirect('admin/?action=added');
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


function insertChapter(req, res) {
    var chapter = new Chapter();
    chapter.name = req.body.name;
    chapter.save((err, doc) => {
        if (!err)
            {
                event.emit('addedWord', 'added Chapitre: '+chapter.name);
                res.redirect('admin/?action=added');
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


module.exports = router;