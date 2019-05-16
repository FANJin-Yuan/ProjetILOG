const mongoose = require('mongoose');

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
    chapterId : {
        type: mongoose.Schema.Types.ObjectId
    },
});

mongoose.model('Character', characterSchema);
