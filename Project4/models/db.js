const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Project4', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./chapter.model.js');