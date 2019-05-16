# README-DEVELOPPER

Ce fichier sert à adier la developper à bien comprendre et utiliser de cette programme. Il s'est organisé comme la suite:

1.  outils à installer et config. environnement de développement
2.  présentation de l'architecture, des concepts
3.  documentation du code


### outiles à installer et configuration:
L'environnement de local serveur est nécessaire, il faut installer la suite web serveur( nous avons chioisi WampServer, un suite légé et user-friendly, cliquez [ici](http://www.wampserver.com/en/download-wampserver-64bits/ "Download wampserver 64-bits") à installer).
Chaque fois avant d'utilier ce produit, être sur la serveur est en train de dérouler.
    
Dézippez la fichier dans la chemin sous la serveur WamperServer: "C:\~\wamp64\www", vous allez avoir un dossier nommé: "OnlineLibrary" et il y a deux sous-dossiers: "base" et "program",todo

    
### présentation de l'architecture, des concepts
    
La programme est contitué par 4 fichiers:  
    
- libraryView.html:
 l'interface utilisateur pour l'arrangement de la page web.
 La première partie permette aux utilisateurs à faire la recherche avec appellant l'évenement "onClick".
- adminiRequest.js: 
 il envoie la requête XMLHttpRequest au fichier model.php, et recevoit la réponse, en suite il transfère les données text contient dans la réponse à la format JSON.
- searchRequest.js: 
 la view-model qui réalise la databinding entre les éléments DOM avec l'entrée d'utilisateur dans la partie "search". 
- clearTabHTML.js:
 effacer l'historique d'operation.
- libraryServer.php: 
 la model qui manipule les données. Il fait la recherche, l'insersion, la supression, et la modification dans un fichier .csv local, selon la numéro d'operation. Ensuite il retourne la résultat de traitement sous la forme de text. 

La patron de conception MVVM est dépolyé dans le structure comment ci-dessous:


 

### documentation du code
