# README-DEV

Ce fichier sert à aider le développeur à bien comprendre et utiliser de ce programme. Il s'est organisé comme la suite :

1.  Outils à installer et config. environnement de développement
2.	Présentation de l'architecture, des concepts
3.	Documentation du code



### Outils à installer et configuration :
L'environnement de local serveur est nécessaire, il faut installer la suite web serveur (nous avons choisi WampServer, une suite lège et user-friendly, cliquez [ici](http://www.wampserver.com/en/download-wampserver-64bits/ "Download wampserver 64-bits") à installer).
Chaque fois avant d'utiliser ce produit, être sur le serveur est en train de dérouler.
    
Dézippez la fichier dans la chemin sous la serveur WampServer : "C : ~\wamp64\www", vous allez avoir un dossier nommé : "WebLibrary" et il y a deux sous-dossiers: "base" et "program", coupe la dossier "base" dans la racine de driver "c:\base".
    
### Présentation de l'architecture, des concepts
    
Le programme est constitué par 4 fichiers :

-   libraryView.html : 

    l'interface utilisateur pour l'arrangement de la page web. La première partie permette aux utilisateurs à faire la recherche en appelant l'évènement "onClick" dans chaque formulaire.

-	adminiRequest.js : 

    il envoie la requête XMLHttpRequest au fichier libraryServer.php, et reçoit la réponse, en suite il transfère les données texte contient dans la réponse à la format JSON.

-	searchRequest.js : 

    la view-model qui réalise la databinding entre les éléments DOM avec l'entrée d'utilisateur dans la partie "search".

-	clearTabHTML.js : 

    effacer l'historique d'opération.
	
-   libraryServer.php: 

    la model qui manipule les données. Il fait la recherche, l'insertion, la suppression, et la modification dans un fichier .csv local, selon le numéro d'opération et il retourne le résultat de traitement sous la forme de texte.

Le patron de conception MVVM est déployé entre l'interface, la module de recherche et le serveur. Le détail technique de databinding entre le view et view-model est dans la partie documentation du code. 


 

### Documentation du code

>  La liaison de données peut mettre à jour plusieurs éléments sur le DOM lorsque la valeur est modifiée lorsqu'un événement DOM est déclenché ou lorsque le modèle est modifié.

Nous avons créé une nouvelle méthode Binding() pour réaliser le databinding.

Dans le fonction binding, la méthode permette de personnaliser ou même réécrire les méthodes getter et setter pour un objet.
```javascript
    Object.defineProperty(b.object, b.property, {
        get: this.valueGetter,
        set: this.valueSetter
    }); 
```


Nous créons la liaison par la méthode addBinding pour la resultat de recherche dans un arbre DOM (les informations de livres) et l’affichage dans la page HTML « innerHTML »:

```javascript
/**
    * bind a new element
	*/	
    this.addBinding = function(element, attribute, event){
        var binding = {
            element: element,
            attribute: attribute
        }
        if (event){
            element.addEventListener(event, function(event){
                _this.valueSetter(element[attribute]);
            })
            binding.event = event
        }       
        this.elementBindings.push(binding)
        element[attribute] = _this.value
        return _this
    }
```

Quand l’utilisateur fait une recherche, le programme continue d’écouter la reponse de http request et mettre à jour les informations dans la structure DOM. 
```javascript
if(this.readyState == 4 && xhr.status == 200){
    			bookInfo = xhr.responseText;
				var responseJSON = JSON.parse(xhr.responseText);
			//	bookInfo = responseJSON;
				if(responseJSON.operation == "search" ){
					if(responseJSON.book.isbn != ""){
						/**
						*  get the taget bookInfo
						*/
						var bBookId = responseJSON.book.isbn;
						var bBookName = responseJSON.book.name;
						var bBookAuthor = responseJSON.book.author;
						bookInfo = bBookId + "	" + bBookName + " " + bBookAuthor;
						/**
						*  update the view model 
						*  update the view(html)
						*/
						b.valueSetter(bookInfo)

		
					}else{
						bookInfo = "Not fund";
						b.valueSetter(bookInfo)
					}
	
				}
			}
```
