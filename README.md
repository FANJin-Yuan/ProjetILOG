# Le Dictionnaire Franco-Chinois, grâce à Node.js, une technologie Web Moderne
>Veuillez vous référer au dossier Documentation

Outils pré-requis avant utilisation : 
  - Node.js
  - MongoDB

### Déploiement
  - Créer un workspace et y placer le dossier Project4
  - Mettre en place la base de données MongoDB en y créant une base Project4

### Configurer l'application
  - Modifier le port si besoin dans app.js
  - Modifier l'url de la BDD dans models/db.js si besoin

### Mode d'emploi
  - Se placer dans le dossier projet en invite de commandes
  - Taper node app.js

### Pages disponibles

Vous pourrez accéder aux pages suivantes :
  - url/chapters
  - url/chapters/search
  - url/chapters/dictionnary
  - url/admin

### Axes d'amélioration

- Ajout d’une authentification (couple login/mdp) qui sera stockée dans une nouvelle collection
de la MongoDB. Cette authentification pourra permettre de restreindre l’accès à la vue admin.
- Possibilité de mise en place de session d’utilisation pour garder en cookie des résultats
d’actions que l’utilisateur aura effectué.
- Cette session pourra également permettre à l’utilisateur d’enregistrer des mots dans un
tableau. Ce tableau sera différent pour chaque utilisateur du fait de la mise en place des
sessions.
