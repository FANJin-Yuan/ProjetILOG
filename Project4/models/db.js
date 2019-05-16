const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Project4', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('Web Server Started and Connected to the Database') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./chapter.model.js');
require('./character.model.js');