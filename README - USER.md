## README

### C'est quoi notre produit ?
Online book search system est un site sur ligne qui permette les utilisateurs de configurer son propre biliothèque.

### Qu'est-ce que je peux stocker dans cette base de données ?
Pour l'instant, vous pouvez ici enregistre :

- le nom de la livre
- l'auteur de la livre
- l'ISBN de la livre

En plus, la page est mise à jour dynamiquement qui est très pratique pour voir le statistique.

### Outils à installer et configuration :
L'environnement de local serveur est nécessaire, il faut installer la suite web serveur (nous avons choisi WampServer, une suite lège et user-friendly, cliquez [ici](http://www.wampserver.com/en/download-wampserver-64bits/ "Download wampserver 64-bits") à installer).
Chaque fois avant d'utiliser ce produit, être sur le serveur est en train de dérouler.
    
Téléchargez et dézippez la fichier "WebLibrary.zip" dans la chemin sous la serveur WampServer : "C : ~\wamp64\www", vous allez avoir un dossier nommé : "WebLibrary" et il y a deux sous-dossiers : "base" et "program", coupe la dossier "base" dans la racine de driver "c:\base".


### Comment il-est utilisé ?
- Téléchargez d'abord le fichier .zip et l'extract dans un dossier, grâce à votre navigateur d'internet, vous double-cliquez sur le fichier : Vue.html, ou cliquez droit sur cette bouton->ouvrir dans le navigateur, pour l'utiliser dans un page de browser.
- Utilisez le premier module pour chercher un livre : vous remplissez un seul champ parmi : ISBN, book name, author name et cliquer Search pour faire la recherche, le resultat sera affiche dans une ligne suivant.
- Utilisez les outils administratifs pour :
    - Modifier les informations de la livre : vous entrez l'ISBN de la livre à modifier, et entrez les nouvelles informations ;
    - Ajouter un nouveau livre avec ses : ISBN, nom, nom d'auteur;
    - Supprimer le livre à partir de son ISBN.
	La résultat d'operation administratives sera affiche dans la formulaire "Operation history". 

