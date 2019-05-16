const mongoose = require('mongoose');

var chapterSchema = new mongoose.Schema({
	name: {
        type: String
    },
    characters : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character'
    }],
});

mongoose.model('Chapter', chapterSchema);