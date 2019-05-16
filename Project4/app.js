require('./models/db');
require('./models/chapter.model');
require('./models/character.model');

var bodyParser = require("body-parser");

const express = require('express');


const chapterController = require('./controllers/chapterController');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.listen(80);

app.use('/chapter', chapterController);