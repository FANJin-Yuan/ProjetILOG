const mongoose = require('mongoose');

//Schéma du caractère
var characterSchema = new mongoose.Schema({
    chineseName: {
        type: String
    },
    chinesePhonetic: {
        type: String
    },
    frenchName: {
        type: String
    },
});

mongoose.model('Character', characterSchema);
