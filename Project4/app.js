//Requiert la connexion à la base de données
require('./models/db');
require('./models/chapter.model');
require('./models/character.model');

const bodyParser = require("body-parser");
const express = require("express");
const chapterController = require('./controllers/chapterController');
const adminController = require('./controllers/adminController');
const app = express();

//Utilisation d'un parser JSON pour les requêtes
app.use(bodyParser.urlencoded({ extended: true }));

//On utilise le moteur de templating EJS de Node.js (alias html pour ejs dans le cas présent)
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


app.listen(80);

//alias de routage dans les controllers
app.use('/chapters', chapterController);
app.use('/admin', adminController);